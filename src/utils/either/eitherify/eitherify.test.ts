import eitherify from './eitherify';
import { expect as expectChai } from 'chai';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';

const ERROR_MESSAGE: string = 'less then zero!';
const func = (v: number) => {
  if (v < 0) {
    throw new Error(ERROR_MESSAGE);
  }
  return v;
};

describe('utils', () => {
  describe('either', () => {
    describe(`eitherify`, () => {
      let result: Either<AppError, number>;

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(() => {
          result = eitherify(func)
            .apply(null, [value]);
        });

        it(`Should create new Either monad with value in right side, if value has been returned`, () => {
          result.do({
            right: (v: number): void => {
              expectChai(v)
                .to.be.an('number');
              expectChai(v)
                .to.be.equal(value);
            },
            left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
          });

        });
      });

      describe(`Left side`, () => {
        const value: number = -10;
        beforeAll(() => {
          result = eitherify(func)
            .apply(null, [value]);
        });

        it(`Should create new Either monad with exact error in left side, if error has been thrown`, () => {
          result.do({
            right: (): void => fail(`Right side has not been expected`),
            left: (error: AppError) => {
              expect(error)
                .toBeInstanceOf(AppError);
              expect(error.message)
                .toEqual(ERROR_MESSAGE);
            }
          });
        });
      });
    });
  });
});
