import { DataSource } from 'typeorm';
import { BaseFactory } from '../classes/BaseFactory';
import { BaseStaticFixture } from '../classes/StaticFixture';
import { FactoryConstructor, FixtureConstructor, FixtureResult } from '../classes/types';
import { createFactoryIdentifier, getIdentifier } from '../decorators/identifiers';
import { Type } from '../types';
import FixtureManager, { FixtureLoadFilters } from './fixtureManager';
import Importer, { ImportResult, sortConstructors } from './importer';

export interface FixtureRootOptions {
  readonly filePatterns?: string[];
  readonly factories?: FactoryConstructor[];
  readonly fixtures?: FixtureConstructor[];
  readonly dataSource: DataSource;
}

export class FixtureContainer {
  constructor(private readonly options: FixtureRootOptions) {}

  private constructorCache?: ImportResult;
  private factoryInstanceCache: Record<string, BaseFactory<unknown>> = {};
  private staticFixtureResultCache: Record<string, unknown> = {};
  private manager!: FixtureManager;

  public async loadFiles(): Promise<void> {
    if (this.constructorCache) {
      return;
    }
    this.constructorCache = await new Importer(this.options.filePatterns ?? []).import();

    const manuallyImportedItems = sortConstructors([
      ...(this.options.factories ?? []),
      ...(this.options.fixtures ?? []),
    ]);
    this.constructorCache.staticFixtures.push(...manuallyImportedItems.staticFixtures);
    this.constructorCache.factories.push(...manuallyImportedItems.factories);

    for (const factoryConstructor of this.constructorCache.factories) {
      const targetName = getIdentifier(factoryConstructor);
      this.factoryInstanceCache[targetName] = this.instantiateFactory(factoryConstructor);
    }

    this.manager = new FixtureManager(
      {
        static: this.constructorCache.staticFixtures,
      },
      (buildMe) => this.instantiateFixture(buildMe),
      (key, value) => {
        this.staticFixtureResultCache[key] = value;
      },
      this.options.dataSource.manager
    );
  }

  public async installFixtures(options?: FixtureLoadFilters): Promise<void> {
    if (!this.constructorCache) {
      throw new Error('Fixture files have not been imported yet');
    }
    await this.manager.loadAll(options);
  }

  public clearFixtureResult(): void {
    this.staticFixtureResultCache = {};
  }

  public factoryOf<EntityType>(
    type: Type<EntityType>,
    name?: string
  ): BaseFactory<EntityType> | undefined {
    const key = createFactoryIdentifier(type, name);
    if (key in this.factoryInstanceCache) {
      return this.factoryInstanceCache[key] as BaseFactory<EntityType>;
    }
    return undefined;
  }

  public fixtureResultOf<T extends BaseStaticFixture<unknown>>(
    type: Type<T>
  ): FixtureResult<T> | undefined {
    const key = getIdentifier(type);

    if (key in this.staticFixtureResultCache) {
      return this.staticFixtureResultCache[key] as FixtureResult<T>;
    }

    return undefined;
  }

  private instantiateFactory(buildMe: FactoryConstructor) {
    return new buildMe({
      getFactoryInstance: (type) => this.factoryOf(type),
    });
  }

  private instantiateFixture(buildMe: FixtureConstructor) {
    return new buildMe({
      getFactoryInstance: (type) => this.factoryOf(type),
      fixtureResultOf: (type) => this.fixtureResultOf(type),
    });
  }
}
