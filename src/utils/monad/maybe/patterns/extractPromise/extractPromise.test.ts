import extractPromise from './extractPromise';
import { Maybe } from 'tsmonad';

describe('abstractions', () => {
  describe('maybe', () => {
    describe(`pattern`, () => {
      describe(`extractPromise`, () => {
        let maybe: Maybe<Promise<number>>;
        let result: Maybe<number>;

        describe(`Maybe just`, () => {
          const value: number = 10;
          beforeAll(async () => {
            maybe = Maybe.just<Promise<number>>(Promise.resolve(value));
            result = await maybe.caseOf(extractPromise());
          });

          it('Should resolve Maybe with value.', () => {
            result.do({
              just: (val: number): void => {
                expect(val).toBeNumber;
                expect(val).toEqual(value);
              },
              nothing: () => fail(`Maybe nothing has not been expected`)
            });
          });
        });

        describe(`Maybe nothing`, () => {
          beforeAll(async () => {
            maybe = Maybe.nothing<Promise<number>>();
            result = await maybe.caseOf(extractPromise());
          });

          it('Should resolve Maybe with nothing', () => {
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
