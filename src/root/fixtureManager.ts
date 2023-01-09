import { EntityManager } from 'typeorm';
import {
  FixtureConstructor,
  StaticFixtureConstructor,
} from '../classes/types';
import { CLASS_DEPENDENCIES } from '../decorators/constants';
import { FixtureType, getFixtureType, getIdentifier } from '../decorators/identifiers';
import resolveLoadOrder from './dependency';
import { BaseFixture } from '../classes/BaseFixture';

export interface FixtureLoadFilters {
  only?: FixtureConstructor[];
  propagateDependencies?: boolean;
}

export interface FixtureConstructors {
  static: StaticFixtureConstructor[];
}

type BuildMe = (
    buildMe: FixtureConstructor
) => BaseFixture<unknown, unknown>

export default class FixtureManager {
  constructor(
    private readonly constructors: FixtureConstructors,
    private readonly instantiator: BuildMe,
    private readonly onFixtureResult: (key: string, value: unknown) => void,
    private readonly manager: EntityManager
  ) {}

  public async loadAll(options?: FixtureLoadFilters): Promise<void> {
    let loadOrder: string[];

    if (options?.only) {
      const propagate = options.propagateDependencies ?? true;
      const onlyKeys = options.only.map((item) => getIdentifier(item));
      if (propagate) {
        loadOrder = resolveLoadOrder(this.buildDependencyInput(), {
          traversalRoots: onlyKeys,
        });
      } else {
        loadOrder = resolveLoadOrder(this.buildDependencyInput(), {
          traversalRoots: onlyKeys,
          traversalNodes: onlyKeys,
        });
      }
    } else {
      loadOrder = resolveLoadOrder(this.buildDependencyInput());
    }

    const fixtureMap = this.buildFixtureMap();

    await this.manager.transaction('SERIALIZABLE',async (entityManager) => {
      for (const key of loadOrder) {
        if (getFixtureType(fixtureMap[key]) !== FixtureType.STATIC) {
          continue;
        }

        const instance = this.instantiator(fixtureMap[key]);
        this.onFixtureResult(key, await instance.install(entityManager, undefined));
      }
    })
  }

  private buildDependencyInput() {
    return [...this.constructors.static].map((item) => {
      const dependencies = Reflect.getMetadata(CLASS_DEPENDENCIES, item.prototype);
      return {
        dependencies: this.depListToString(dependencies),
        key: getIdentifier(item),
      };
    });
  }

  private buildFixtureMap(): Record<string, FixtureConstructor> {
    return [...this.constructors.static].reduce((prev, now) => {
      return { ...prev, [getIdentifier(now)]: now };
    }, {});
  }

  private depListToString(list: FixtureConstructor[]) {
    return list.map((item) => getIdentifier(item));
  }
}
