import asyncBind from './asyncBind';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

describe('utils', () => {
  describe('either', () => {
    describe(`asyncBind`, () => {
      let func: jest.Mock<Promise<Either<AppError, number>>, [number]>;
      let spiedLift;
      let spiedCaseOf;

      beforeAll(() => {
        spiedLift = jest.spyOn(Either.prototype, 'fmap');
        spiedCaseOf = jest.spyOn(Either.prototype, 'caseOf');

        func = jest.fn().mockImplementation((v: number): Promise<Either<AppError, number>> => Promise.resolve(Either.right<AppError, number>(v)));
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(async () => {
          jest.clearAllMocks();
          await asyncBind(func)
            .apply(null, [Either.right<AppError, number>(value)]);
        });

        it(`Should apply the function passed as parameter on the object`, () => {
          expect(spiedLift)
            .toHaveBeenCalledTimes(1);
          expect(spiedLift)
            .toHaveBeenCalledWith(func);
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
          expect(func)
            .toHaveBeenCalledTimes(1);
          expect(func)
            .toHaveBeenCalledWith(value);
        });
      });

      describe(`Left side`, () => {
        const appError: AppError = new InternalServerError();
        beforeAll(async () => {
          jest.clearAllMocks();

          await asyncBind(func)
            .apply(null, [Either.left<AppError, number>(appError)]);
        });

        it(`Should not apply the function passed as parameter on the object`, () => {
          expect(spiedLift)
            .toHaveBeenCalledTimes(1);
          expect(spiedLift)
            .toHaveBeenCalledWith(func);
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
          expect(func)
            .toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});
