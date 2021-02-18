import caseOf from './caseOf';
import { AppError } from 'common/error';
import { Either, EitherPatterns } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

describe('utils', () => {
  describe('either', () => {
    describe(`caseOf`, () => {
      let pattern: EitherPatterns<AppError, number, number>;
      let unwraper: jest.Mock<any, [any]>;
      let spiedCaseOf;

      beforeAll(() => {
        spiedCaseOf = jest.spyOn(Either.prototype, 'caseOf');
        unwraper = jest.fn().mockImplementation(<T> (v: T): T => v);
        pattern = { right: unwraper, left: unwraper };
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();

          caseOf(pattern)
            .apply(null, [Either.right<AppError, number>(value)]);
        });

        it(`Should unwrap either right side value`, () => {
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
          expect(spiedCaseOf)
            .toHaveBeenCalledWith(pattern);
          expect(unwraper)
            .toHaveBeenCalledTimes(1);
          expect(unwraper)
            .toHaveBeenCalledWith(value);
        });
      });

      describe(`Left side`, () => {
        const appError: AppError = new InternalServerError();

        beforeAll(() => {
          jest.clearAllMocks();

          caseOf(pattern)
            .apply(null, [Either.left<AppError, number>(appError)]);
        });

        it(`Should unwrap either left side value`, () => {
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
          expect(spiedCaseOf)
            .toHaveBeenCalledWith(pattern);
          expect(unwraper)
            .toHaveBeenCalledTimes(1);
          expect(unwraper)
            .toHaveBeenCalledWith(appError);
        });
      });
    });
  });
});
