import doer from './doer';
import { AppError } from 'common/error';
import { Either, OptionalEitherPatterns } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

describe('utils', () => {
  describe('either', () => {
    describe(`doer`, () => {
      let pattern: OptionalEitherPatterns<AppError, number, void>;
      let side_effect: jest.Mock<void, [any]>;
      let spiedDo;

      beforeAll(() => {
        side_effect = jest.fn().mockReturnValue(null);
        spiedDo = jest.spyOn(Either.prototype, 'do');
        pattern = { right: side_effect, left: side_effect };
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();

          doer(pattern)
            .apply(null, [Either.right<AppError, number>(value)]);
        });

        it(`Should call side_effect function with right side value (number)`, () => {
          expect(spiedDo)
            .toHaveBeenCalledTimes(1);
          expect(spiedDo)
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

          doer(pattern)
            .apply(null, [Either.left<AppError, number>(appError)]);
        });

        it(`Should call side_effect function with left side value (AppError)`, () => {
          expect(spiedDo)
            .toHaveBeenCalledTimes(1);
          expect(spiedDo)
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
