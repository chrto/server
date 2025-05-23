import valueOrNothing from './valueOrNothing';
import { Maybe } from 'tsmonad';

describe('utils', () => {
  describe('maybe', () => {
    describe(`pattern`, () => {
      describe(`valueOrNothing`, () => {
        let result: Maybe<number>;
        describe(`Maybe just`, () => {
          const value: number = 10;
          beforeAll(() => {
            result = valueOrNothing
              .apply(null, [value]);
          });

          it('Should be Maybe with value', () => {
            result.do({
              just: (val: number): void => {
                expect(val).toBeNumber;
                expect(val).toEqual(value);
              },
              nothing: () => fail(`Nothing has not been expected`)
            });
          });
        });

        describe(`Maybe nothing`, () => {
          const value: number = null;
          beforeAll(() => {
            result = valueOrNothing
              .apply(null, [value]);
          });

          it('Should be Maybe with nothing', () => {
            result.do({
              just: (): void => fail(`Maybe just has not been expected`),
              nothing: () => expect.pass
            });
          });
        });
      });
    });
  });
});
