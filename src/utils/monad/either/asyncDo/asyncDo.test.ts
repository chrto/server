import asyncDoer from './asyncDoer';
import { expect as expectChai } from 'chai';
import { Either, OptionalEitherPatterns } from 'tsmonad';
import { Fcn } from 'common/types';
import { AppError } from 'common/error';
import { InternalServerError } from 'common/httpErrors';

let globalValue: number;

describe('utils', () => {
  describe('either', () => {
    describe(`asyncDoer`, () => {
      let pattern: OptionalEitherPatterns<AppError, number, Promise<void>>;
      let side_effect: Fcn<[any], Promise<void>>;
      let either: Either<AppError, number>;
      let result: Either<AppError, number>;

      beforeAll(() => {
        side_effect = async (v: any): Promise<void> => {
          globalValue = v;
          return Promise.resolve(null);
        };
        pattern = { right: side_effect, left: side_effect };
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(async () => {
          either = Either.right<AppError, number>(value);
          result = await asyncDoer(pattern)
            .apply(null, [either]);
        });

        it(`Should return the original value, so is meant for running functions with side-effects`, () => {
          expectChai(result)
            .to.be.equals(either);
          expectChai(globalValue)
            .to.be.equals(value);
        });
      });

      describe(`Right side - pattern is optional`, () => {
        const value: number = 10;
        beforeAll(async () => {
          globalValue = null;
          either = Either.right<AppError, number>(value);

          result = await asyncDoer({ left: side_effect })
            .apply(null, [either]);
        });

        it(`Should return the original value, so is meant for running functions with side-effects`, () => {
          expectChai(result)
            .to.be.equals(either);
          expectChai(globalValue)
            .to.be.equals(null);
        });
      });

      describe(`Left side`, () => {
        const error: AppError = new InternalServerError();
        beforeAll(async () => {
          either = Either.left<AppError, number>(error);
          result = await asyncDoer(pattern)
            .apply(null, [either]);
        });

        it(`Should return the original value, so is meant for running functions with side-effects`, () => {
          expectChai(result)
            .to.be.equals(either);
          expectChai(globalValue)
            .to.be.equals(error);
        });
      });

      describe(`Left side - pattern is optional`, () => {
        const error: AppError = new InternalServerError();
        beforeAll(async () => {
          globalValue = null;
          either = Either.left<AppError, number>(error);
          result = await asyncDoer({ right: side_effect })
            .apply(null, [either]);
        });

        it(`Should return the original value, so is meant for running functions with side-effects`, () => {
          expectChai(result)
            .to.be.equals(either);
          expectChai(globalValue)
            .to.be.equals(null);
        });
      });
    });
  });
});
