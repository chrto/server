import fTap from './fTap';
import { expect as expectChai } from 'chai';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

let globalV: number;
const appError: AppError = new InternalServerError();
const side_effect = (v: number): Either<AppError, void> =>
  v > 0 ? (globalV = v, Either.right<AppError, void>(null)) : Either.left<AppError, void>(appError);

describe('utils', () => {
  describe('either', () => {
    describe(`fTap`, () => {
      let value: number;
      let either: Either<AppError, number>;
      let result: Either<AppError, number>;

      describe(`Right side`, () => {
        describe('success', () => {
          beforeAll(() => {
            globalV = undefined;
            value = 10;
            either = Either.right<AppError, number>(value);
            result = fTap(side_effect)
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

        describe('fail', () => {
          beforeAll(() => {
            globalV = undefined;
            value = -10;
            either = Either.right<AppError, number>(value);
            result = fTap(side_effect)
              .apply(null, [either]);
          });
          it(`Should not return same Either`, () => {
            expectChai(result)
              .to.not.be.equals(either);
          });

          it(`Should not set global variable with exact value`, () => {
            expectChai(globalV)
              .to.be.an('undefined');
          });

          it(`Should return new Either with exact error in left side`, () => {
            result.do({
              right: (): void => fail(`Right side has not been expected`),
              left: (error: AppError) => {
                expect(error)
                  .toBeInstanceOf(AppError);
                expect(error.message)
                  .toEqual(appError.message);
              }
            });
          });
        });
      });

      describe(`Left side`, () => {
        const ERROR_MESSAGE: string = 'original error message..';
        const ERROR: AppError = new AppError('code', ERROR_MESSAGE);
        beforeAll(() => {
          globalV = undefined;
          either = Either.left<AppError, number>(ERROR);
          result = fTap(side_effect)
            .apply(null, [either]);
        });

        it(`Should not return same Either`, () => {
          expectChai(result)
            .to.not.be.equals(either);
        });

        it(`Should not set global variable with exact value`, () => {
          expectChai(globalV)
            .to.be.an('undefined');
        });

        it(`Should return new Either with original error in left side`, () => {
          result.do({
            right: (): void => fail(`Right side has not been expected`),
            left: (err: AppError) => {
              expect(err)
                .toBeInstanceOf(AppError);
              expect(err.message)
                .toEqual(ERROR_MESSAGE);
            }
          });
        });
      });
    });
  });
});
