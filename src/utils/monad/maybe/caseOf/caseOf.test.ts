import caseOf from './caseOf';
import { expect as expectChai } from 'chai';
import { Fcn } from 'common/types';
import { Maybe, MaybePatterns } from 'tsmonad';

describe('abstractions', () => {
  describe('maybe', () => {
    describe(`caseOf`, () => {
      let pattern: MaybePatterns<number, number>;
      let just_unwraper: Fcn<[any], any>;
      let nothing_unwraper: Fcn<[], any>;
      let maybe: Maybe<number>;
      let result: number | null;

      beforeAll(() => {
        just_unwraper = <T> (v: T): T => v;
        nothing_unwraper = <T> (): T => null;
        pattern = { just: just_unwraper, nothing: nothing_unwraper };
      });

      describe(`Maybe just`, () => {
        const value: number = 10;
        beforeAll(() => {
          maybe = Maybe.just<number>(value);
          result = caseOf(pattern)
            .apply(null, [maybe]);
        });

        it(`Should return unwraped value from maybe`, () => {
          expectChai(result)
            .to.be.equals(value);
        });
      });

      describe(`Maybe nothing`, () => {
        beforeAll(() => {
          maybe = Maybe.nothing<number>();
          result = caseOf(pattern)
            .apply(null, [maybe]);
        });

        it(`Should return null`, () => {
          expectChai(result)
            .to.be.equals(null);
        });
      });
    });
  });
});
