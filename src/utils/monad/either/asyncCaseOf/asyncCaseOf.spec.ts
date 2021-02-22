import asyncCaseOf from './asyncCaseOf';
import { AppError } from 'common/error';
import { Either, EitherPatterns } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

describe('utils', () => {
  describe('either', () => {
    describe(`asyncCaseOf`, () => {
      let pattern: EitherPatterns<AppError, number, Promise<number>>;
      let asyncUnwraperRight: jest.Mock<Promise<any>, [any]>;
      let asyncUnwraperLeft: jest.Mock<Promise<any>, [AppError]>;
      let spiedCaseOf;

      beforeAll(() => {
        spiedCaseOf = jest.spyOn(Either.prototype, 'caseOf');
        asyncUnwraperRight = jest.fn().mockImplementation(<T> (v: T): Promise<T> => Promise.resolve(v));
        asyncUnwraperLeft = jest.fn().mockImplementation(<T> (e: AppError): Promise<T> => Promise.reject(e));
        pattern = { right: asyncUnwraperRight, left: asyncUnwraperLeft };
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(async () => {
          jest.clearAllMocks();

          await asyncCaseOf(pattern)
            .apply(null, [Either.right<AppError, number>(value)]);
        });

        it(`Should resolve with unwrapped right side value`, () => {
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
          expect(spiedCaseOf)
            .toHaveBeenCalledWith(pattern);
          expect(asyncUnwraperRight)
            .toHaveBeenCalledTimes(1);
          expect(asyncUnwraperRight)
            .toHaveBeenCalledWith(value);
        });
      });

      describe(`Left side`, () => {
        const appError: AppError = new InternalServerError();

        beforeAll(async () => {
          jest.clearAllMocks();

          await asyncCaseOf(pattern)
            .apply(null, [Either.left<AppError, number>(appError)])
            .catch((_e) => null);
        });

        it(`Should reject with unwrapped left side value`, () => {
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
          expect(spiedCaseOf)
            .toHaveBeenCalledWith(pattern);
          expect(asyncUnwraperLeft)
            .toHaveBeenCalledTimes(1);
          expect(asyncUnwraperLeft)
            .toHaveBeenCalledWith(appError);
        });
      });
    });
  });
});
