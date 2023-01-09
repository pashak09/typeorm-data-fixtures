import { StaticFixture } from '../../src';
import { BaseStaticFixture } from '../../src';
import { User } from '../entity/User';
import { EntityManager } from 'typeorm';

@StaticFixture()
export class UserFixture extends BaseStaticFixture<readonly User[]> {
  public async install(manager: EntityManager): Promise<readonly User[]> {
    return await manager.save([new User('user_1'), new User('user_2')]);
  }
}
