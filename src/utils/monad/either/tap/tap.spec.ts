import tap from './tap';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

describe('utils', () => {
  describe('either', () => {
    describe(`tap`, () => {
      let side_effect: jest.Mock<void, [any]>;
      let spiedDo;

      beforeAll(() => {
        side_effect = jest.fn().mockReturnValue(null);
        spiedDo = jest.spyOn(Either.prototype, 'do');
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();

          tap(side_effect)
            .apply(null, [Either.right<AppError, number>(value)]);
        });

        it(`Should call side_effect function with right side value (number)`, () => {
          expect(spiedDo)
            .toHaveBeenCalledTimes(1);
          expect(spiedDo)
            .toHaveBeenCalledWith({ right: side_effect });
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

          tap(side_effect)
            .apply(null, [Either.left<AppError, number>(appError)]);
        });

        it(`Should not call side_effect function for left side`, () => {
          expect(spiedDo)
            .toHaveBeenCalledTimes(1);
          expect(spiedDo)
            .toHaveBeenCalledWith({ right: side_effect });
          expect(side_effect)
            .toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});
