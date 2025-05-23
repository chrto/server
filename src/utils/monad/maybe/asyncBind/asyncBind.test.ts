import asyncBind from './asyncBind';
import { Maybe } from 'tsmonad';

const func = (v: number): Promise<Maybe<number>> => Promise.resolve(Maybe.just<number>(v));

describe('abstractions', () => {
  describe('maybe', () => {
    describe(`asyncBind`, () => {
      let maybe: Maybe<number>;
      let result: Maybe<number>;

      describe(`maybe just`, () => {
        const value: number = 10;
        beforeAll(async () => {
          maybe = Maybe.just<number>(value);
          result = await asyncBind(func)
            .apply(null, [maybe]);
        });

        it(`Should resolve with new Maybe`, () => {
          expect(result).not.toBe(maybe);
        });

        it(`Should resolve result of the function func wrapped inside an Maybe object.`, () => {
          result.do({
            just: (v: number): void => {
              expect(v).toBeNumber;
              expect(v).toEqual(value);
            },
            nothing: () => fail(`Nothing has not been expected`)
          });
        });
      });

      describe(`meybe nothing`, () => {
        beforeAll(async () => {
          maybe = Maybe.nothing<number>();
          result = await asyncBind(func)
            .apply(null, [maybe]);
        });

        it(`Should return new Maybe`, () => {
          expect(result).not.toBe(maybe);
        });

        it(`Should resolve Maybe with nothing.`, () => {
          result.do({
            just: (): void => fail(`Just has not been expected`),
            nothing: () => expect.pass
          });
        });
      });
    });
  });
});
