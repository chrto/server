import asyncLift from './asyncLift';
import { Maybe } from 'tsmonad';

describe('abstraction', () => {
  describe('maybe', () => {
    describe(`asyncLift`, () => {
      let func: jest.Mock<Promise<number>, [number]>;
      let spiedLift;
      let spiedCaseOf;

      beforeAll(() => {
        spiedLift = jest.spyOn(Maybe.prototype, 'fmap');
        spiedCaseOf = jest.spyOn(Maybe.prototype, 'caseOf');

        func = jest.fn().mockImplementation((v: number): Promise<number> => Promise.resolve(v));
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Maybe just`, () => {
        const value: number = 10;
        beforeAll(async () => {
          jest.clearAllMocks();
          await asyncLift(func)
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

      describe(`Maybe nothing`, () => {
        beforeAll(async () => {
          jest.clearAllMocks();

          await asyncLift(func)
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
