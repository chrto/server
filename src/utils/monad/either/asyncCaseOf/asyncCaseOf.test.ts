import asyncCaseOf from './asyncCaseOf';
import { AppError } from 'common/error';
import { Either, EitherPatterns } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

const PATTERN: EitherPatterns<AppError, number, Promise<number>> = {
  right: <T> (v: T): Promise<T> => Promise.resolve(v),
  left: <T> (e: AppError): Promise<T> => Promise.reject(e)
};

describe('utils', () => {
  describe('either', () => {
    describe(`asyncCaseOf`, () => {

      describe(`Right side`, () => {
        let result: number;
        const value: number = 10;
        beforeAll(async () => {
          result = await asyncCaseOf(PATTERN)
            .apply(null, [Either.right<AppError, number>(value)]);
        });

        it(`Should resolve with unwrapped right side value`, () => {
          expect(result).toBeNumber;
          expect(result).toEqual(value);
        });
      });

      describe(`Left side`, () => {
        let result: AppError;
        const appError: AppError = new InternalServerError();

        beforeAll(async () => {
          jest.clearAllMocks();

          result = await asyncCaseOf(PATTERN)
            .apply(null, [Either.left<AppError, number>(appError)])
            .catch((e) => e);
        });

        it(`Should reject with unwrapped left side value`, () => {
          expect(result).toBeInstanceOf(AppError);
          expect(result.message).toEqual(appError.message);
        });
      });
    });
  });
});
