import extractPromiseMaybe from './extractPromiseMaybe';
import { expect as expectChai } from 'chai';
import { Maybe } from 'tsmonad';

describe('abstraction', () => {
  describe('maybe', () => {
    describe(`pattern`, () => {
      describe(`extractPromiseMaybe`, () => {
        let maybe: Maybe<Promise<Maybe<number>>>;
        let result: Maybe<number>;

        describe(`Just`, () => {
          const value: number = 10;
          beforeAll(async () => {
            maybe = Maybe.just<Promise<Maybe<number>>>(Promise.resolve(Maybe.just<number>(value)));
            result = await maybe.caseOf(extractPromiseMaybe());
          });

          it('Should resolve Maybe with value in just side.', () => {
            result.do({
              just: (val: number): void => {
                expectChai(val)
                  .to.be.an('number')
                  .which.is.equal(value);
              },
              nothing: () => fail(`Nothing has not been expected`)
            });
          });
        });

        describe(`Nothing`, () => {
          beforeAll(async () => {
            maybe = Maybe.nothing<Promise<Maybe<number>>>();
            result = await maybe.caseOf(extractPromiseMaybe());
          });

          it('Should resolve Maybe with nothing side', () => {
            result.do({
              just: (): void => fail(`Just has not been expected`),
              nothing: () => expect.pass
            });
          });
        });
      });
    });
  });
});
