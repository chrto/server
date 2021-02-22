import forError from './forError';
import { expect as expectChai } from 'chai';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

const func = (error: AppError): AppError => new AppError(error.code, `${error.message} - transformed`);

describe('utils', () => {
  describe('either', () => {
    describe(`forError`, () => {
      let either: Either<AppError, number>;
      let result: Either<AppError, number>;
      describe(`Right side`, () => {
        const value: number = 10;

        beforeAll(() => {
          either = Either.right<AppError, number>(value);
          result = forError(func)
            .apply(null, [either]);
        });

        it(`Should return new Either`, () => {
          expectChai(result)
            .to.not.be.equals(either);
        });

        it(`Should return same value wrapped inside an Either object.`, () => {
          result.do({
            right: (v: number): void => {
              expectChai(v)
                .to.be.an('number')
                .which.is.equals(value);
            },
            left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
          });

        });

        describe(`Left side`, () => {
          const appError: AppError = new InternalServerError();
          beforeAll(() => {
            either = Either.left<AppError, number>(appError);
            result = forError(func)
              .apply(null, [either]);
          });

          it(`Should return new Either`, () => {
            expectChai(result)
              .to.not.be.equals(either);
          });

          it(`Should return result of the function func wrapped inside an Either object.`, () => {
            result.do({
              right: (): void => fail(`Right side has not been expected`),
              left: (error: AppError) => {
                expect(error)
                  .toBeInstanceOf(AppError);
                expect(error.message)
                  .toEqual(`${appError.message} - transformed`);
              }
            });
          });
        });
      });
    });
  });
});
