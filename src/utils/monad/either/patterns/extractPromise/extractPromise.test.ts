import extractPromise from './extractPromise';
import { expect as expectChai } from 'chai';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

describe('utils', () => {
  describe('either', () => {
    describe(`pattern`, () => {
      describe(`extractPromise`, () => {
        let either: Either<AppError, Promise<number>>;
        let result: Either<AppError, number>;

        describe(`Right side`, () => {
          const value: number = 10;
          beforeAll(async () => {
            either = Either.right<AppError, Promise<number>>(Promise.resolve(value));
            result = await either.caseOf(extractPromise());
          });

          it('Should resolve either with value in right side.', () => {
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
          const ERROR: AppError = new InternalServerError();
          beforeAll(async () => {
            either = Either.left<AppError, Promise<number>>(ERROR);
            result = await either.caseOf(extractPromise());
          });

          it('Should resolve either with error in left side', () => {
            result.do({
              right: (): void => fail(`Right side has not been expected`),
              left: (error: AppError) => {
                expectChai(error)
                  .to.be.instanceOf(AppError);
                expectChai(error.message)
                  .to.be.equals(ERROR.message);
              }
            });
          });
        });
      });
    });
  });
});
