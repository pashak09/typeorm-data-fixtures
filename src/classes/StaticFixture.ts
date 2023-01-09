import { BaseFixture } from './BaseFixture';

export abstract class BaseStaticFixture<T = void> extends BaseFixture<
  T,
  undefined
> {}
