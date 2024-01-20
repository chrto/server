import asyncDoer from './asyncDoer';
import { expect as expectChai } from 'chai';
import { Fcn } from 'common/types';
import { Maybe, OptionalMaybePatterns } from 'tsmonad';

let globalValue: number;

describe('abstractions', () => {
  describe('maybe', () => {
    describe(`asyncDoer`, () => {
      let pattern: OptionalMaybePatterns<number, Promise<void>>;
      let just_side_effect: Fcn<[any], Promise<void>>;
      let nothing_side_effect: Fcn<[], Promise<void>>;
      let maybe: Maybe<number>;
      let result: Maybe<number>;

      beforeAll(() => {
        just_side_effect = async (v: any): Promise<void> => {
          globalValue = v;
          return Promise.resolve(null);
        };
        nothing_side_effect = async (): Promise<void> => {
          return Promise.resolve(null);
        };
        pattern = { just: just_side_effect, nothing: nothing_side_effect };
      });

      describe(`Maybe just`, () => {
        const value: number = 10;
        beforeAll(async () => {
          maybe = Maybe.just<number>(value);
          result = await asyncDoer(pattern)
            .apply(null, [maybe]);
        });

        it(`Should return the original value, so is meant for running functions with side-effects`, () => {
          expectChai(result)
            .to.be.equals(maybe);
          expectChai(globalValue)
            .to.be.equals(value);
        });
      });

      describe(`Maybe just - pattern is optional`, () => {
        const value: number = 10;
        beforeAll(async () => {
          globalValue = null;
          maybe = Maybe.just<number>(value);

          result = await asyncDoer({ nothing: nothing_side_effect })
            .apply(null, [maybe]);
        });

        it(`Should return the original value, so is meant for running functions with side-effects`, () => {
          expectChai(result)
            .to.be.equals(maybe);
          expectChai(globalValue)
            .to.be.equals(null);
        });
      });

      describe(`Maybe nothing`, () => {
        beforeAll(async () => {
          maybe = Maybe.nothing<number>();
          pattern = { just: just_side_effect, nothing: nothing_side_effect };
          result = await asyncDoer(pattern)
            .apply(null, [maybe]);
        });

        it(`Should return the original value, so is meant for running functions with side-effects`, () => {
          expectChai(result)
            .to.be.equals(maybe);
          expectChai(globalValue)
            .to.be.equals(null);
        });
      });

      describe(`Maybe nothing - pattern is optional`, () => {
        beforeAll(async () => {
          globalValue = null;
          maybe = Maybe.nothing<number>();
          result = await asyncDoer({ just: just_side_effect })
            .apply(null, [maybe]);
        });

        it(`Should return the original value, so is meant for running functions with side-effects`, () => {
          expectChai(result)
            .to.be.equals(maybe);
          expectChai(globalValue)
            .to.be.equals(null);
        });
      });
    });
  });
});
