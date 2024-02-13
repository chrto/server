import doer from './doer';
import { AppError } from 'common/error';
import { Either, OptionalEitherPatterns } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';
import { Fcn } from 'common/types';

let globalValue: number;

describe('utils', () => {
  describe('either', () => {
    describe(`doer`, () => {
      let pattern: OptionalEitherPatterns<AppError, number, void>;
      let side_effect: Fcn<[any], void>;
      let either: Either<AppError, number>;
      let result: Either<AppError, number>;

      beforeAll(() => {
        side_effect = (v: any): void => {
          globalValue = v;
        };
        pattern = { right: side_effect, left: side_effect };
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(() => {
          either = Either.right<AppError, number>(value);
          result = doer(pattern)
            .apply(null, [either]);
        });

        it(`Should return the original value, so is meant for running functions with side-effects`, () => {
          expect(result).toBe(either);
          expect(globalValue).toEqual(value);
        });
      });

      describe(`Left side`, () => {
        const error: AppError = new InternalServerError();
        beforeAll(() => {
          either = Either.left<AppError, number>(error);
          result = doer(pattern)
            .apply(null, [either]);
        });

        it(`Should return the original value, so is meant for running functions with side-effects`, () => {
          expect(result).toBe(either);
          expect(globalValue).toBeInstanceOf(AppError);
          expect(globalValue['message']).toEqual(error.message);
        });
      });
    });
  });
});
