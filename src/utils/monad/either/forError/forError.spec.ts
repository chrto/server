import forError from './forError';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

describe('utils', () => {
  describe('either', () => {
    describe(`forError`, () => {
      let func: jest.Mock<AppError, [AppError]>;
      let spiedCaseOf;

      beforeAll(() => {
        spiedCaseOf = jest.spyOn(Either.prototype, 'caseOf');
        func = jest.fn().mockImplementation((error: AppError): AppError => new AppError(error.code, `${error.message} - transformed`));
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();
          forError(func)
            .apply(null, [Either.right<AppError, number>(value)]);
        });

        it(`Should not apply the function passed as parameter on the right side value`, () => {
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
          expect(func)
            .toHaveBeenCalledTimes(0);
        });
      });

      describe(`Left side`, () => {
        const appError: AppError = new InternalServerError();

        beforeAll(() => {
          jest.clearAllMocks();
          forError(func)
            .apply(null, [Either.left<AppError, number>(appError)]);
        });

        it(`Should apply the function passed as parameter on the left side value`, () => {
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
          expect(func)
            .toHaveBeenCalledTimes(1);
          expect(func)
            .toHaveBeenCalledWith(appError);
        });
      });
    });
  });
});
