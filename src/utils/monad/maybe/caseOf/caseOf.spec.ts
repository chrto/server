import { Maybe, MaybePatterns } from 'tsmonad';
import caseOf from './caseOf';

describe('abstractions', () => {
  describe('maybe', () => {
    describe(`caseOf`, () => {
      let pattern: MaybePatterns<number, number>;
      let just_unwraper: jest.Mock<any, [any]>;
      let nothing_unwraper: jest.Mock<any, []>;
      let spiedCaseOf;

      beforeAll(() => {
        spiedCaseOf = jest.spyOn(Maybe.prototype, 'caseOf');
        just_unwraper = jest.fn().mockImplementation(<T> (v: T): T => v);
        nothing_unwraper = jest.fn().mockImplementation(<T> (): T => null);
        pattern = { just: just_unwraper, nothing: nothing_unwraper };
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Maybe just`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();

          caseOf(pattern)
            .apply(null, [Maybe.just<number>(value)]);
        });

        it(`Should unwrap value from Maybe`, () => {
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
          expect(spiedCaseOf)
            .toHaveBeenCalledWith(pattern);
          expect(just_unwraper)
            .toHaveBeenCalledTimes(1);
          expect(just_unwraper)
            .toHaveBeenCalledWith(value);
          expect(nothing_unwraper)
            .toHaveBeenCalledTimes(0);
        });
      });

      describe(`Meybe nothing`, () => {
        beforeAll(() => {
          jest.clearAllMocks();

          caseOf(pattern)
            .apply(null, [Maybe.nothing<number>()]);
        });

        it(`Should unwrap Meybe nothing`, () => {
          expect(spiedCaseOf)
            .toHaveBeenCalledTimes(1);
          expect(spiedCaseOf)
            .toHaveBeenCalledWith(pattern);
          expect(nothing_unwraper)
            .toHaveBeenCalledTimes(1);
          expect(nothing_unwraper)
            .toHaveBeenCalledWith();
          expect(just_unwraper)
            .toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});
