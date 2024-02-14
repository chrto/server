import extractPromiseEither from './extractPromiseEither';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

describe('utils', () => {
  describe('either', () => {
    describe(`pattern`, () => {
      describe(`extractPromiseEither`, () => {
        let either: Either<AppError, Promise<Either<AppError, number>>>;
        let result: Either<AppError, number>;

        describe(`Right side`, () => {
          const value: number = 10;
          beforeAll(async () => {
            either = Either.right<AppError, Promise<Either<AppError, number>>>(Promise.resolve(Either.right<AppError, number>(value)));
            result = await either.caseOf(extractPromiseEither());
          });

          it('Should resolve either with value in right side.', () => {
            result.do({
              right: (val: number): void => {
                expect(val).toBeNumber;
                expect(val).toEqual(value);
              },
              left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
            });
          });
        });

        describe(`Left side`, () => {
          const ERROR: AppError = new InternalServerError();
          beforeAll(async () => {
            either = Either.left<AppError, Promise<Either<AppError, number>>>(ERROR);
            result = await either.caseOf(extractPromiseEither());
          });

          it('Should resolve either with error in left side', () => {
            result.do({
              right: (): void => fail(`Right side has not been expected`),
              left: (error: AppError) => {
                expect(error).toBeInstanceOf(AppError);
                expect(error.message).toEqual(ERROR.message);
              }
            });
          });
        });
      });
    });
  });
});
