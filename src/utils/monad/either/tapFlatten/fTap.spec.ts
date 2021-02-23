import fTap from './fTap';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

describe('utils', () => {
  describe('either', () => {
    describe(`fTap`, () => {
      let side_effect: jest.Mock<Either<AppError, void>, [any]>;
      let spiedBind;
      let spiedCaseOf;

      beforeAll(() => {
        side_effect = jest.fn().mockReturnValue(Either.right<AppError, void>(null));
        spiedBind = jest.spyOn(Either.prototype, 'bind');
        spiedCaseOf = jest.spyOn(Either.prototype, 'caseOf');
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();

          fTap(side_effect)
            .apply(null, [Either.right<AppError, number>(value)]);
        });

        it(`Should call side_effect function with right side value (number)`, () => {
          expect(spiedBind)
            .toHaveBeenCalledTimes(1);
          expect(spiedBind)
            .toHaveBeenCalledWith(side_effect);
          expect(side_effect)
            .toHaveBeenCalledTimes(1);
          expect(side_effect)
            .toHaveBeenCalledWith(value);
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
        });
      });

      describe(`Left side`, () => {
        const appError: AppError = new InternalServerError();

        beforeAll(() => {
          jest.clearAllMocks();

          fTap(side_effect)
            .apply(null, [Either.left<AppError, number>(appError)]);
        });

        it(`Should not call side_effect function for left side value`, () => {
          expect(spiedBind)
            .toHaveBeenCalledTimes(1);
          expect(spiedBind)
            .toHaveBeenCalledWith(side_effect);
          expect(side_effect)
            .toHaveBeenCalledTimes(0);
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
