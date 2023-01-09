import { FixtureConstructor } from '../classes/types';

export interface FixtureOptions {
  dependencies?: readonly FixtureConstructor[];
}
