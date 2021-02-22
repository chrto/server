import takeRight from './takeRight';
import { expect as expectChai } from 'chai';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';

describe('utils', () => {
  describe('either', () => {
    describe(`pattern`, () => {
      describe(`takeRight`, () => {
        let either: Either<AppError, number>;
        let result: number;

        describe(`Right side`, () => {
          const value: number = 10;
          beforeAll(() => {
            either = Either.right<AppError, number>(value);
            result = either.caseOf(takeRight());
          });

          it('Should return value, if right side.', () => {
            expectChai(result)
              .to.be.an('number')
              .which.is.equal(value);
          });
        });

        describe(`Left side`, () => {
          beforeAll(() => {
            either = Either.left<AppError, number>(new AppError('code', 'message'));
            result = either.caseOf(takeRight());
          });

          it('Should return null, if left side.', () => {
            expectChai(result)
              .to.be.null;
          });
        });
      });
    });
  });
});
