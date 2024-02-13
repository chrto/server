import asyncLift from './asyncLift';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

const func = (v: number): Promise<number> => Promise.resolve(v === 0 ? null : v);

describe('utils', () => {
  describe('either', () => {
    describe(`asyncLift`, () => {
      let either: Either<AppError, number>;
      let result: Either<AppError, number>;

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(async () => {
          either = Either.right<AppError, number>(value);
          result = await asyncLift(func)
            .apply(null, [either]);
        });

        it(`Should resolve with new Either`, () => {
          expect(result).not.toBe(either);
        });

        it(`Should resolve result of the function func wrapped inside an Either object.`, () => {
          result.do({
            right: (v: number): void => {
              expect(v).toBeNumber;
              expect(v).toEqual(value);
            },
            left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
          });
        });
      });

      describe(`Right side with null result`, () => {
        const value: number = 0;
        beforeAll(async () => {
          either = Either.right<AppError, number>(value);
          result = await asyncLift(func)
            .apply(null, [either]);
        });

        it(`Should resolve with new Either`, () => {
          expect(result).not.toBe(either);
        });

        it(`Should resolve with exact error wrapped inside an Either object, if result of the function func is null.`, () => {
          result.do({
            right: (): void => fail(`Right side has not been expected`),
            left: (error: AppError) => {
              expect(error).toBeInstanceOf(AppError);
              expect(error.message).toEqual('Got null value');
            }
          });
        });
      });

      describe(`Left side`, () => {
        const appError: AppError = new InternalServerError();

        beforeAll(async () => {
          either = Either.left<AppError, number>(appError);
          result = await asyncLift(func)
            .apply(null, [either]);
        });

        it(`Should return new Either`, () => {
          expect(result).not.toBe(either);
        });

        it(`Should resolve same error wrapped inside an Either object.`, () => {
          result.do({
            right: (): void => fail(`Right side has not been expected`),
            left: (error: AppError) => {
              expect(error).toBeInstanceOf(AppError);
              expect(error.message).toEqual(appError.message);
            }
          });
        });
      });
    });
  });
});
