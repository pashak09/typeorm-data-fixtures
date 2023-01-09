import { FactoryBridge, FixtureBridge } from '../root/bridge';
import { UnPromisify } from '../types';
import { BaseFactory } from './BaseFactory';
import { BaseFixture } from './BaseFixture';
import { BaseStaticFixture } from './StaticFixture';

export type FactoryConstructor = new (bridge: FactoryBridge) => BaseFactory<unknown>;

export type FixtureConstructor = new (bridge: FixtureBridge) => BaseFixture<unknown, unknown>;
export type StaticFixtureConstructor = new (bridge: FixtureBridge) => BaseStaticFixture<unknown>;

export type FixtureResult<FixtureType extends BaseFixture<unknown, unknown>> = UnPromisify<
  ReturnType<FixtureType['install']>
>;
