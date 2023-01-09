import { BaseFactory } from '../..';
import { Factory } from '../../decorators/Factory';
import { StaticFixture } from '../../decorators/Fixture';
import { BaseStaticFixture } from '../../classes/StaticFixture';

export class TargetEntity {}

@StaticFixture()
export class TestFixture extends BaseStaticFixture<void> {
  public install(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

@Factory(TargetEntity)
export class TestFactory extends BaseFactory<TargetEntity> {
  protected createRandom(): TargetEntity {
    throw new Error('Method not implemented.');
  }
}
