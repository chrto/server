import asyncBind from './asyncBind';
import { Maybe } from 'tsmonad';

describe('abstractons', () => {
  describe('maybe', () => {
    describe(`asyncBind`, () => {
      let func: jest.Mock<Promise<Maybe<number>>, [number]>;
      let spiedLift;
      let spiedCaseOf;

      beforeAll(() => {
        spiedLift = jest.spyOn(Maybe.prototype, 'fmap');
        spiedCaseOf = jest.spyOn(Maybe.prototype, 'caseOf');

        func = jest.fn().mockImplementation((v: number): Promise<Maybe<number>> => Promise.resolve(Maybe.just<number>(v)));
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(async () => {
          jest.clearAllMocks();
          await asyncBind(func)
            .apply(null, [Maybe.just<number>(value)]);
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
        beforeAll(async () => {
          jest.clearAllMocks();

          await asyncBind(func)
            .apply(null, [Maybe.nothing<number>()]);
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
