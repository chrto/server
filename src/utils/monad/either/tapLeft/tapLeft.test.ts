import tapLeft from './tapLeft';
import { expect as expectChai } from 'chai';
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
          expectChai(result)
            .to.be.equals(either);
        });

        it(`Should not set global variable`, () => {
          expectChai(globalV)
            .to.be.an('undefined');
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
          expectChai(result)
            .to.be.equals(either);
        });

        it(`Should set global variable with exact error`, () => {
          expectChai(globalV)
            .to.be.instanceOf(AppError)
            .which.is.equal(appError);
        });
      });
    });
  });
});
