import { join } from 'path';
import { DataSource } from 'typeorm';

import { ENTITIES } from './entity';
import { FixtureContainer } from '../src';

(async (): Promise<void> => {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    database: 'test',
    username: 'foo',
    password: 'foo',
    entities: ENTITIES,
    synchronize: true,
    logging: false,
  });

  try {
    await dataSource.initialize();

    const fixtureContainer = new FixtureContainer({
      filePatterns: [join(__dirname, 'fixtures/**/*.ts')],
      dataSource: dataSource,
    });

    await fixtureContainer.loadFiles();
    await fixtureContainer.installFixtures();
  } catch (err) {
    throw err;
  } finally {
    await dataSource.destroy();
  }

  console.log('\x1b[42m', 'Done', '\x1b[0m');
})();
