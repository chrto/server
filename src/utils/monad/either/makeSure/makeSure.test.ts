import makeSure from './makeSure';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

const ERROR: AppError = new InternalServerError();
const predicate = (v: number): boolean => v > 0 ? true : false;

describe('utils', () => {
  describe('either', () => {
    describe(`makeSure`, () => {
      let result: Either<AppError, number>;
      let value: number;
      describe(`Right side`, () => {
        value = 10;
        beforeAll(() => {
          result = makeSure(predicate, ERROR)
            .apply(null, [value]);
        });

        it(`Should return Either with value in right side`, () => {
          result.do({
            right: (v: number): void => {
              expect(v).toBeNumber;
              expect(v).toEqual(value);
            },
            left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
          });
        });
      });

      describe(`Left side`, () => {
        beforeAll(() => {
          value = -10;
          result = makeSure(predicate, ERROR)
            .apply(null, [value]);
        });

        it(`Should return Either with exact error in left side`, () => {
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
