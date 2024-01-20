import { Maybe, OptionalMaybePatterns } from 'tsmonad';
import doer from './doer';

describe('abstractions', () => {
  describe('maybe', () => {
    describe(`doer`, () => {
      let pattern: OptionalMaybePatterns<number, void>;
      let just_side_effect: jest.Mock<void, [any]>;
      let nothing_side_effect: jest.Mock<void, []>;
      let spiedDo;

      beforeAll(() => {
        just_side_effect = jest.fn().mockReturnValue(null);
        nothing_side_effect = jest.fn().mockReturnValue(null);
        spiedDo = jest.spyOn(Maybe.prototype, 'do');
        pattern = { just: just_side_effect, nothing: nothing_side_effect };
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Maybe just`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();

          doer(pattern)
            .apply(null, [Maybe.just<number>(value)]);
        });

        it(`Should call side_effect function with right side value (number)`, () => {
          expect(spiedDo)
            .toHaveBeenCalledTimes(1);
          expect(spiedDo)
            .toHaveBeenCalledWith(pattern);
          expect(just_side_effect)
            .toHaveBeenCalledTimes(1);
          expect(just_side_effect)
            .toHaveBeenCalledWith(value);
          expect(nothing_side_effect)
            .toHaveBeenCalledTimes(0);
        });
      });

      describe(`Meybe nothing`, () => {
        beforeAll(() => {
          jest.clearAllMocks();

          doer(pattern)
            .apply(null, [Maybe.nothing<number>()]);
        });

        it(`Should call side_effect function with left side value (CollectorError)`, () => {
          expect(spiedDo)
            .toHaveBeenCalledTimes(1);
          expect(spiedDo)
            .toHaveBeenCalledWith(pattern);
          expect(nothing_side_effect)
            .toHaveBeenCalledTimes(1);
          expect(nothing_side_effect)
            .toHaveBeenCalledWith();
          expect(just_side_effect)
            .toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});
