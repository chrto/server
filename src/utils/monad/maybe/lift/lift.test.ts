import lift from './lift';
import { expect as expectChai } from 'chai';
import { Maybe } from 'tsmonad';

const func = (v: number): number => v;

describe('abstractions', () => {
  describe('maybe', () => {
    describe(`lift`, () => {
      let maybe: Maybe<number>;
      let result: Maybe<number>;

      describe(`Maybe just`, () => {
        const value: number = 10;
        beforeAll(() => {
          maybe = Maybe.just<number>(value);
          result = lift(func)
            .apply(null, [maybe]);
        });

        it(`Should return new Maybe`, () => {
          expectChai(result)
            .to.not.be.equals(maybe);
        });

        it(`Should return result of the function func wrapped inside an Maybe object.`, () => {
          result.do({
            just: (v: number): void => {
              expectChai(v)
                .to.be.an('number');
              expectChai(v)
                .to.be.equals(value);
            },
            nothing: () => fail(`Nothing has not been expected`)
          });
        });
      });

      describe(`Maybe nothing`, () => {

        beforeAll(() => {
          maybe = Maybe.nothing<number>();
          result = lift(func)
            .apply(null, [maybe]);
        });

        it(`Should return new Maybe`, () => {
          expectChai(result)
            .to.not.be.equals(maybe);
        });

        it(`Should return Maybe with nothing.`, () => {
          result.do({
            just: (): void => fail(`Just has not been expected`),
            nothing: () => expect.pass
          });
        });
      });
    });
  });
});
