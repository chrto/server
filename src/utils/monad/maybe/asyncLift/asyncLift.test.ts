import asyncLift from './asyncLift';
import { expect as expectChai } from 'chai';
import { Maybe } from 'tsmonad';

const func = (v: number): Promise<number> => Promise.resolve(v === 0 ? null : v);

describe('abstractions', () => {
  describe('maybe', () => {
    describe(`asyncLift`, () => {
      let maybe: Maybe<number>;
      let result: Maybe<number>;

      describe(`Maybe just`, () => {
        const value: number = 10;
        beforeAll(async () => {
          maybe = Maybe.just<number>(value);
          result = await asyncLift(func)
            .apply(null, [maybe]);
        });

        it(`Should resolve with new Maybe`, () => {
          expectChai(result)
            .to.not.be.equals(maybe);
        });

        it(`Should resolve result of the function func wrapped inside an Maybe object.`, () => {
          result.do({
            just: (v: number): void => {
              expectChai(v)
                .to.be.an('number');
              expectChai(v)
                .to.be.equals(value);
            },
            nothing: () => fail(`Maybe nothing has not been expected`)
          });
        });
      });

      describe(`Maybe just with null result`, () => {
        const value: number = 0;
        beforeAll(async () => {
          maybe = Maybe.just<number>(value);
          result = await asyncLift(func)
            .apply(null, [maybe]);
        });

        it(`Should resolve with new Maybe`, () => {
          expectChai(result)
            .to.not.be.equals(maybe);
        });

        it(`Should resolve with Maybe nothing object, if result of the function func is null.`, () => {
          result.do({
            just: (): void => fail(`Maybe just has not been expected`),
            nothing: () => expect.pass
          });
        });
      });

      describe(`Maybe nothing`, () => {
        beforeAll(async () => {
          maybe = Maybe.nothing<number>();
          result = await asyncLift(func)
            .apply(null, [maybe]);
        });

        it(`Should return new Maybe`, () => {
          expectChai(result)
            .to.not.be.equals(maybe);
        });

        it(`Should resolve Maybe nothing object.`, () => {
          result.do({
            just: (): void => fail(`Maybe just has not been expected`),
            nothing: () => expect.pass
          });
        });
      });
    });
  });
});
