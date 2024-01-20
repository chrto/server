import lift from './lift';
import { Maybe } from 'tsmonad';

describe('abstractions', () => {
  describe('maybe', () => {
    describe(`lift`, () => {
      let func: jest.Mock<number, [number]>;
      let spiedLift;

      beforeAll(() => {
        spiedLift = jest.spyOn(Maybe.prototype, 'fmap');
        func = jest.fn().mockImplementation((v: number): number => v);
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Maybe just`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();
          lift(func)
            .apply(null, [Maybe.just<number>(value)]);
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

      describe(`Maybe nothing`, () => {
        beforeAll(() => {
          jest.clearAllMocks();

          lift(func)
            .apply(null, [Maybe.nothing<number>()]);
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
