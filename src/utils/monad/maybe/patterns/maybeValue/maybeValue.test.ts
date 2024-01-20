import maybeValue from './maybeValue';
import { expect as expectChai } from 'chai';
import { Maybe } from 'tsmonad';

describe('abstractions', () => {
  describe('maybe', () => {
    describe(`pattern`, () => {
      describe(`maybeValue`, () => {
        let result: Maybe<number>;
        describe(`Maybe just`, () => {
          const value: number = 10;
          beforeAll(() => {
            result = maybeValue
              .apply(null, [value]);
          });

          it('Should be Maybe with value', () => {
            result.do({
              just: (val: number): void => {
                expectChai(val)
                  .to.be.an('number')
                  .which.is.equal(value);
              },
              nothing: () => fail(`Maybe nothing has not been expected`)
            });
          });
        });

        describe(`Maybe nothing`, () => {
          const value: number = null;
          beforeAll(() => {
            result = maybeValue
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
