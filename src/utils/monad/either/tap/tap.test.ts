import tap from './tap';
import { expect as expectChai } from 'chai';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

let globalV: number;
const side_effect = (v: number): void => {
  globalV = v;
};

describe('utils', () => {
  describe('either', () => {
    describe(`tap`, () => {
      let either: Either<AppError, number>;
      let result: Either<AppError, number>;

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(() => {
          either = Either.right<AppError, number>(value);
          result = tap(side_effect)
            .apply(null, [either]);
        });

        it(`Should return same Either`, () => {
          expectChai(result)
            .to.be.equals(either);
        });

        it(`Should set global variable with exact value`, () => {
          expectChai(globalV)
            .to.be.an('number')
            .which.is.equal(value);
        });
      });

      describe(`Left side`, () => {
        const appError: AppError = new InternalServerError();
        beforeAll(() => {
          either = Either.left<AppError, number>(appError);
          result = tap(side_effect)
            .apply(null, [either]);
        });

        it(`Should return same Either`, () => {
          expectChai(result)
            .to.be.equals(either);
        });
      });
    });
  });
});
