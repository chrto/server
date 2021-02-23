import tapLeft from './tapLeft';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

describe('utils', () => {
  describe('either', () => {
    describe(`tapLeft`, () => {
      let left_side_effect: jest.Mock<void, [any]>;
      let spiedDo;

      beforeAll(() => {
        left_side_effect = jest.fn().mockReturnValue(null);
        spiedDo = jest.spyOn(Either.prototype, 'do');
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();

          tapLeft(left_side_effect)
            .apply(null, [Either.right<AppError, number>(value)]);
        });

        it(`Should not call left_side_effect function for right side`, () => {
          expect(spiedDo)
            .toHaveBeenCalledTimes(1);
          expect(spiedDo)
            .toHaveBeenCalledWith({ left: left_side_effect });
          expect(left_side_effect)
            .toHaveBeenCalledTimes(0);
        });
      });

      describe(`Left side`, () => {
        const appError: AppError = new InternalServerError();

        beforeAll(() => {
          jest.clearAllMocks();

          tapLeft(left_side_effect)
            .apply(null, [Either.left<AppError, number>(appError)]);
        });

        it(`Should call left_side_effect function for left side`, () => {
          expect(spiedDo)
            .toHaveBeenCalledTimes(1);
          expect(spiedDo)
            .toHaveBeenCalledWith({ left: left_side_effect });
          expect(left_side_effect)
            .toHaveBeenCalledTimes(1);
          expect(left_side_effect)
            .toHaveBeenCalledWith(appError);
        });
      });
    });
  });
});
