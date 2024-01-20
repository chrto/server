import asyncTap from './asyncTap';
import { AppError } from 'common/error/error';
import { Either } from 'tsmonad';
import { InternalCollectorError } from 'common/error/collectorErrors';

describe('utils', () => {
  describe('either', () => {
    describe(`asyncDoer`, () => {
      let side_effect: jest.Mock<Promise<void>, [any]>;
      let spiedCaseOf;

      beforeAll(() => {
        side_effect = jest.fn().mockResolvedValue(null);
        spiedCaseOf = jest.spyOn(Either.prototype, 'caseOf');
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();

          asyncTap(side_effect)
            .apply(null, [Either.right<AppError, number>(value)]);
        });

        it(`Should call side_effect function with right side value (number)`, () => {
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
          expect(side_effect)
            .toHaveBeenCalledTimes(1);
          expect(side_effect)
            .toHaveBeenCalledWith(value);
        });
      });

      describe(`Left side`, () => {
        const appError: AppError = new InternalCollectorError();

        beforeAll(() => {
          jest.clearAllMocks();

          asyncTap(side_effect)
            .apply(null, [Either.left<AppError, number>(appError)]);
        });

        it(`Should not call side_effect function with left side value`, () => {
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
          expect(side_effect)
            .toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});
