import 'reflect-metadata';
import { BaseStaticFixture } from '../classes/StaticFixture';
import { CLASS_DEPENDENCIES, CLASS_IDENTIFIER, FIXTURE_MARK, MARK_VALUE } from './constants';
import { StaticFixture } from './Fixture';

@StaticFixture()
class TestFixture extends BaseStaticFixture {
  public install(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

@StaticFixture({ dependencies: [TestFixture] })
class DepTestFixture extends BaseStaticFixture {
  public install(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

@StaticFixture()
class TxFixture extends BaseStaticFixture {
  public install(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

describe('@Fixture', () => {
  describe('Static', () => {
    it('marks class as factory', () => {
      expect(Reflect.hasMetadata(FIXTURE_MARK, TestFixture.prototype)).toBeTruthy();
      expect(Reflect.getMetadata(FIXTURE_MARK, TestFixture.prototype)).toEqual(MARK_VALUE);
    });
    it('sets class identifier as constructor name', () => {
      expect(Reflect.getMetadata(CLASS_IDENTIFIER, TestFixture.prototype)).toMatch(
        /^FIXTURE_STATIC_TestFixture_.{8}$/
      );
    });
    it('dependencies is empty array if not given', () => {
      expect(Reflect.getMetadata(CLASS_DEPENDENCIES, TestFixture.prototype)).toEqual([]);
    });
    it('dependencies set if given', () => {
      expect(Reflect.getMetadata(CLASS_DEPENDENCIES, DepTestFixture.prototype)).toEqual([
        TestFixture,
      ]);
    });
    it('throws error if decorated twice', () => {
      const test = () => {
        @StaticFixture()
        @StaticFixture()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class DoubleTestFixture extends BaseStaticFixture<void> {
          public install(): Promise<void> {
            throw new Error('Method not implemented.');
          }
        }
      };
      expect(test).toThrowError();
    });
  });
});
