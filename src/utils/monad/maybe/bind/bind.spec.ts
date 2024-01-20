import bind from './bind';
import { Maybe } from 'tsmonad';

describe('abstractions', () => {
  describe('maybe', () => {
    describe(`bind`, () => {
      let func: jest.Mock<Maybe<number>, [number]>;
      let spiedBind;

      beforeAll(() => {
        spiedBind = jest.spyOn(Maybe.prototype, 'bind');
        func = jest.fn().mockImplementation((v: number): Maybe<number> => Maybe.just<number>(v));
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`maybe just`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();
          bind(func)
            .apply(null, [Maybe.just<number>(value)]);
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

      describe(`maybe nothing`, () => {
        beforeAll(() => {
          jest.clearAllMocks();

          bind(func)
            .apply(null, [Maybe.nothing<number>()]);
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
