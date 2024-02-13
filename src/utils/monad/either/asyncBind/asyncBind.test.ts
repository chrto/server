import asyncBind from './asyncBind';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

const func = (v: number): Promise<Either<AppError, number>> => Promise.resolve(Either.right<AppError, number>(v));

describe('utils', () => {
  describe('either', () => {
    describe(`asyncBind`, () => {
      let either: Either<AppError, number>;
      let result: Either<AppError, number>;

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(async () => {
          either = Either.right<AppError, number>(value);
          result = await asyncBind(func)
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

      describe(`Left side`, () => {
        const appError: AppError = new InternalServerError();

        beforeAll(async () => {
          either = Either.left<AppError, number>(appError);
          result = await asyncBind(func)
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
