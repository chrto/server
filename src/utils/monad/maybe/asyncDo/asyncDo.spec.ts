import { Maybe, OptionalMaybePatterns } from 'tsmonad';
import asyncDoer from './asyncDoer';

describe('abstractions', () => {
  describe('maybe', () => {
    describe(`asyncDoer`, () => {
      let pattern: OptionalMaybePatterns<number, Promise<void>>;
      let just_side_effect: jest.Mock<Promise<void>, [any]>;
      let nothing_side_effect: jest.Mock<Promise<void>, []>;
      let spiedCaseOf;

      beforeAll(() => {
        just_side_effect = jest.fn().mockResolvedValue(null);
        nothing_side_effect = jest.fn().mockResolvedValue(null);
        spiedCaseOf = jest.spyOn(Maybe.prototype, 'caseOf');
        pattern = { just: just_side_effect, nothing: nothing_side_effect };
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Maybe just`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();

          asyncDoer(pattern)
            .apply(null, [Maybe.just<number>(value)]);
        });

        it(`Should call just_side_effect function with value (number)`, () => {
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
          expect(spiedCaseOf)
            .toHaveBeenCalledWith(pattern);
          expect(just_side_effect)
            .toHaveBeenCalledTimes(1);
          expect(just_side_effect)
            .toHaveBeenCalledWith(value);
          expect(nothing_side_effect)
            .toHaveBeenCalledTimes(0);
        });
      });

      describe(`Left side`, () => {
        beforeAll(() => {
          jest.clearAllMocks();

          asyncDoer(pattern)
            .apply(null, [Maybe.nothing<number>()]);
        });

        it(`Should call nothing_side_effect function`, () => {
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
          expect(spiedCaseOf)
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
