import asyncDoer from './asyncDoer';
import { Either, OptionalEitherPatterns } from 'tsmonad';
import { AppError } from 'common/error';
import { InternalServerError } from 'common/httpErrors';

describe('utils', () => {
  describe('either', () => {
    describe(`asyncDoer`, () => {
      let pattern: OptionalEitherPatterns<AppError, number, Promise<void>>;
      let side_effect: jest.Mock<Promise<void>, [any]>;
      let spiedCaseOf;

      beforeAll(() => {
        side_effect = jest.fn().mockResolvedValue(null);
        spiedCaseOf = jest.spyOn(Either.prototype, 'caseOf');
        pattern = { right: side_effect, left: side_effect };
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();

          asyncDoer(pattern)
            .apply(null, [Either.right<AppError, number>(value)]);
        });

        it(`Should call side_effect function with right side value (number)`, () => {
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
          expect(spiedCaseOf)
            .toHaveBeenCalledWith(pattern);
          expect(side_effect)
            .toHaveBeenCalledTimes(1);
          expect(side_effect)
            .toHaveBeenCalledWith(value);
        });
      });

      describe(`Left side`, () => {
        const appError: AppError = new InternalServerError();

        beforeAll(() => {
          jest.clearAllMocks();

          asyncDoer(pattern)
            .apply(null, [Either.left<AppError, number>(appError)]);
        });

        it(`Should call side_effect function with left side value (CollectorError)`, () => {
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
          expect(spiedCaseOf)
            .toHaveBeenCalledWith(pattern);
          expect(side_effect)
            .toHaveBeenCalledTimes(1);
          expect(side_effect)
            .toHaveBeenCalledWith(appError);
        });
      });
    });
  });
});
