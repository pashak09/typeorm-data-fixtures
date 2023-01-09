import { EntityManager, DataSource } from 'typeorm';
import { FixtureContainer } from './index';
import { BaseStaticFixture } from '../classes/StaticFixture';
import { StaticFixture } from '../decorators/Fixture';
import Importer from './importer';

@StaticFixture()
class NoTransactionFixture extends BaseStaticFixture<number> {
  public async install() {
    return 1;
  }
}

@StaticFixture({ dependencies: [NoTransactionFixture] })
class DependentFixture extends BaseStaticFixture<number> {
  public async install() {
    return 2;
  }
}

@StaticFixture()
class SerializableFixture extends BaseStaticFixture<void> {
  public async install(manager: EntityManager) {
    expect(manager.connection.isInitialized).toEqual(true);
    const result = await manager.query('SHOW TRANSACTION ISOLATION LEVEL');
    const level = result[0]['transaction_isolation'];
    expect(level).toEqual('serializable');
  }
}

describe('FixtureManager', () => {
  let dataSource: DataSource;
  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'postgres',
      host: process.env.POSTGRES_HOST ?? 'db',
      database: 'test',
      username: 'foo',
      password: 'foo',
      dropSchema: true,
      entities: [],
      logging: false,
    });

    await dataSource.initialize();
    await dataSource.synchronize();
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  afterEach(() => {
    jest.spyOn(Importer.prototype, 'import').mockRestore();
  });

  it('sets transaction isolation level', async () => {
    const importMock = jest.fn(async () => {
      return {
        factories: [],
        staticFixtures: [NoTransactionFixture, SerializableFixture],
      };
    });
    jest.spyOn(Importer.prototype, 'import').mockImplementation(importMock);
    const instance = new FixtureContainer({ filePatterns: [], dataSource });
    await instance.loadFiles();
    await instance.installFixtures();
  });

  describe('filters', () => {
    it('throws error if not propagated', async () => {
      const instance = new FixtureContainer({
        fixtures: [NoTransactionFixture, DependentFixture],
        dataSource,
      });
      await instance.loadFiles();
      await expect(
        instance.installFixtures({ only: [DependentFixture], propagateDependencies: false })
      ).rejects.toThrowError();
    });
    it('propagates', async () => {
      const instance = new FixtureContainer({
        fixtures: [NoTransactionFixture, DependentFixture],
        dataSource,
      });
      await instance.loadFiles();
      await expect(
        instance.installFixtures({ only: [DependentFixture], propagateDependencies: true })
      ).resolves.not.toThrow();
    });
    it('propagates by default', async () => {
      const instance = new FixtureContainer({
        fixtures: [NoTransactionFixture, DependentFixture],
        dataSource,
      });
      await instance.loadFiles();
      await instance.installFixtures({ only: [DependentFixture] });
      await expect(instance.installFixtures({ only: [DependentFixture] })).resolves.not.toThrow();
    });
  });
});
