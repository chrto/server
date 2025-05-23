import doer from './doer';
import { Fcn } from 'common/types';
import { Maybe, OptionalMaybePatterns } from 'tsmonad';

let globalValue: number;

describe('abstractions', () => {
  describe('maybe', () => {
    describe(`doer`, () => {
      let pattern: OptionalMaybePatterns<number, void>;
      let just_side_effect: Fcn<[any], void>;
      let nothing_side_effect: Fcn<[], void>;
      let maybe: Maybe<number>;
      let result: Maybe<number>;

      beforeAll(() => {
        just_side_effect = (v: any): void => {
          globalValue = v;
        };
        nothing_side_effect = (): void => {
          globalValue = null;
        };
        pattern = { just: just_side_effect, nothing: nothing_side_effect };
      });

      describe(`Maybe just`, () => {
        const value: number = 10;
        beforeAll(() => {
          maybe = Maybe.just<number>(value);
          result = doer(pattern)
            .apply(null, [maybe]);
        });

        it(`Should return the original value, so is meant for running functions with side-effects`, () => {
          expect(result).toBe(maybe);
          expect(globalValue).toEqual(value);
        });
      });

      describe(`Maybe nothing`, () => {
        beforeAll(() => {
          maybe = Maybe.nothing<number>();
          result = doer(pattern)
            .apply(null, [maybe]);
        });

        it(`Should return the original value, so is meant for running functions with side-effects`, () => {
          expect(result).toBe(maybe);
          expect(globalValue).toBeNull;
        });
      });
    });
  });
});
