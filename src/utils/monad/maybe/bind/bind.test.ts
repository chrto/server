import bind from './bind';
import { Maybe } from 'tsmonad';

const func = (v: number): Maybe<number> => Maybe.just<number>(v);

describe('abstractions', () => {
  describe('maybe', () => {
    describe(`bind`, () => {
      let maybe: Maybe<number>;
      let result: Maybe<number>;

      describe(`maybe just`, () => {
        const value: number = 10;
        beforeAll(() => {
          maybe = Maybe.just<number>(value);
          result = bind(func)
            .apply(null, [maybe]);
        });

        it(`Should return new Maybe`, () => {
          expect(result).not.toBe(maybe);
        });

        it(`Should return result of the function func wrapped inside an Maybe object.`, () => {
          result.do({
            just: (v: number): void => {
              expect(v).toBeNumber;
              expect(v).toEqual(value);
            },
            nothing: () => fail(`Nothing has not been expected`)
          });
        });
      });

      describe(`maybe nothing`, () => {
        beforeAll(() => {
          maybe = Maybe.nothing<number>();
          result = bind(func)
            .apply(null, [maybe]);
        });

        it(`Should return new Maybe`, () => {
          expect(result).not.toBe(maybe);
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
