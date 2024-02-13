import tapLeft from './tapLeft';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

let globalV: AppError;
const left_side_effect = (error: AppError): void => {
  globalV = error;
};

describe('utils', () => {
  describe('either', () => {
    describe(`tapLeft`, () => {
      let either: Either<AppError, number>;
      let result: Either<AppError, number>;

      describe(`Right side`, () => {
        beforeAll(() => {
          globalV = undefined;
          either = Either.right<AppError, number>(10);
          result = tapLeft(left_side_effect)
            .apply(null, [either]);
        });

        it(`Should return same Either`, () => {
          expect(result).toBe(either);
        });

        it(`Should not set global variable`, () => {
          expect(globalV).toBeUndefined;
        });
      });

      describe(`Left side`, () => {
        const appError: AppError = new InternalServerError();

        beforeAll(() => {
          globalV = undefined;
          either = Either.left<AppError, number>(appError);
          result = tapLeft(left_side_effect)
            .apply(null, [either]);
        });

        it(`Should return same Either`, () => {
          expect(result).toBe(either);
        });

        it(`Should set global variable with exact error`, () => {
          expect(globalV).toBeInstanceOf(AppError);
          expect(globalV.message).toEqual(appError.message);
        });
      });
    });
  });
});
