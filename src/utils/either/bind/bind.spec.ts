import bind from './bind';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

describe('utils', () => {
  describe('either', () => {
    describe(`bind`, () => {
      let func: jest.Mock<Either<AppError, number>, [number]>;
      let spiedBind;

      beforeAll(() => {
        spiedBind = jest.spyOn(Either.prototype, 'bind');
        func = jest.fn().mockImplementation((v: number): Either<AppError, number> => Either.right<AppError, number>(v));
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();
          bind(func)
            .apply(null, [Either.right<AppError, number>(value)]);
        });

        it(`Should apply the function passed as parameter on the object`, () => {
          expect(spiedBind)
            .toHaveBeenCalledTimes(1);
          expect(spiedBind)
            .toHaveBeenCalledWith(func);
          expect(func)
            .toHaveBeenCalledTimes(1);
          expect(func)
            .toHaveBeenCalledWith(value);
        });
      });

      describe(`Left side`, () => {
        const appError: AppError = new InternalServerError();

        beforeAll(() => {
          jest.clearAllMocks();

          bind(func)
            .apply(null, [Either.left<AppError, number>(appError)]);
        });

        it(`Should not apply the function passed as parameter on the object`, () => {
          expect(spiedBind)
            .toHaveBeenCalledTimes(1);
          expect(spiedBind)
            .toHaveBeenCalledWith(func);
          expect(func)
            .toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});
