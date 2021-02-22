import valueOrError from './valueOrError';
import { expect as expectChai } from 'chai';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { InternalServerError } from 'common/httpErrors';

const ERROR: AppError = new InternalServerError();

describe('utils', () => {
  describe('either', () => {
    describe(`pattern`, () => {
      describe(`valueOrError`, () => {
        let result: Either<AppError, number>;
        describe(`Right side`, () => {
          const value: number = 10;
          beforeAll(() => {
            result = valueOrError(ERROR)
              .apply(null, [value]);
          });

          it('Should be Either with value in right side', () => {
            result.do({
              right: (val: number): void => {
                expectChai(val)
                  .to.be.an('number')
                  .which.is.equal(value);
              },
              left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
            });
          });
        });

        describe(`Left side`, () => {
          const value: number = null;
          beforeAll(() => {
            result = valueOrError(ERROR)
              .apply(null, [value]);
          });

          it('Should be Either with error in left side', () => {
            result.do({
              right: (): void => fail(`Right side has not been expected`),
              left: (error: AppError) => {
                expect(error)
                  .toBeInstanceOf(AppError);
                expect(error.message)
                  .toEqual(ERROR.message);
              }
            });
          });
        });
      });
    });
  });
});
