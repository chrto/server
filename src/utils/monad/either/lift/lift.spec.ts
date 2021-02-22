import lift from './lift';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

describe('utils', () => {
  describe('either', () => {
    describe(`lift`, () => {
      let func: jest.Mock<number, [number]>;
      let spiedLift;

      beforeAll(() => {
        spiedLift = jest.spyOn(Either.prototype, 'fmap');
        func = jest.fn().mockImplementation((v: number): number => v);
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();
          lift(func)
            .apply(null, [Either.right<AppError, number>(value)]);
        });

        it(`Should apply the function passed as parameter on the object`, () => {
          expect(spiedLift)
            .toHaveBeenCalledTimes(1);
          expect(spiedLift)
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

          lift(func)
            .apply(null, [Either.left<AppError, number>(appError)]);
        });

        it(`Should not apply the function passed as parameter on the object`, () => {
          expect(spiedLift)
            .toHaveBeenCalledTimes(1);
          expect(spiedLift)
            .toHaveBeenCalledWith(func);
          expect(func)
            .toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});
