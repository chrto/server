import makeSure from './makeSure';
import { expect as expectChai } from 'chai';
import { Maybe } from 'tsmonad';

const predicate = (v: number): boolean => v > 0 ? true : false;

describe('abstractons', () => {
  describe('maybe', () => {
    describe(`makeSure`, () => {
      let result: Maybe<number>;
      let value: number;

      describe(`Maybe just`, () => {
        value = 10;
        beforeAll(() => {
          result = makeSure(predicate)
            .apply(null, [value]);
        });

        it(`Should return Maybe with value`, () => {
          result.do({
            just: (v: number): void => {
              expectChai(v)
                .to.be.an('number')
                .which.is.equal(value);
            },
            nothing: () => fail(`Nothing has not been expected.`)
          });
        });
      });

      describe(`Maybe nothing`, () => {
        beforeAll(() => {
          value = -10;
          result = makeSure(predicate)
            .apply(null, [value]);
        });

        it(`Should return Maybe with nothing`, () => {
          result.do({
            just: (): void => fail(`Just has not been expected.`),
            nothing: () => expect.pass
          });
        });
      });
    });
  });
});
