import { AppError } from 'common/error';
import valueOrDefault from './valueOrDefault';
import { Either } from 'tsmonad';

const DEFAULT: number = 100;

describe('utils', () => {
  describe('either', () => {
    describe(`pattern`, () => {
      describe(`valueOrDefault`, () => {
        let result: Either<AppError, number>;
        describe(`Right side`, () => {
          const value: number = 10;
          beforeAll(() => {
            result = valueOrDefault(DEFAULT)
              .apply(null, [value]);
          });

          it('Should be Either with value in right side', () => {
            result.do({
              right: (val: number): void => {
                expect(val).toBeNumber;
                expect(val).toEqual(value);
              },
              left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
            });
          });
        });

        describe(`Left side`, () => {
          const value: number = null;
          beforeAll(() => {
            result = valueOrDefault(DEFAULT)
              .apply(null, [value]);
          });

          it('Should be Either with default value in right side', () => {
            result.do({
              right: (val: number): void => {
                expect(val).toBeNumber;
                expect(val).toEqual(DEFAULT);
              },
              left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
            });
          });
        });
      });
    });
  });
});
