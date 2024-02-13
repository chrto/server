import caseOf from './caseOf';
import { AppError } from 'common/error';
import { Either, EitherPatterns } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';
import { Fcn } from 'common/types';

describe('utils', () => {
  describe('either', () => {
    describe(`caseOf`, () => {
      let pattern: EitherPatterns<AppError, number, number>;
      let unwraper: Fcn<[any], any>;
      let either: Either<AppError, number>;
      let result: number | AppError;

      beforeAll(() => {
        unwraper = <T> (v: T): T => v;
        pattern = { right: unwraper, left: unwraper };
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(() => {
          either = Either.right<AppError, number>(value);
          result = caseOf(pattern)
            .apply(null, [either]);
        });

        it(`Should return unwraped rigt side value from either`, () => {
          expect(result).toEqual(value);
        });
      });

      describe(`Left side`, () => {
        const error: AppError = new InternalServerError();
        beforeAll(() => {
          either = Either.left<AppError, number>(error);
          result = caseOf(pattern)
            .apply(null, [either]);
        });

        it(`Should return unwraped left side value from either`, () => {
          expect(result).toBeInstanceOf(AppError);
          expect(result['message']).toEqual(error.message);
        });
      });
    });
  });
});
