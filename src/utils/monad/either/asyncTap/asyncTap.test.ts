import asyncTap from './asyncTap';
import { expect as expectChai } from 'chai';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { Fcn } from 'common/types';

let globalValue: number;

describe('utils', () => {
  describe('either', () => {
    describe(`asyncTap`, () => {
      let side_effect: Fcn<[any], Promise<void>>;
      let either: Either<AppError, number>;
      let result: Either<AppError, number>;

      beforeAll(() => {
        side_effect = async (v: any): Promise<void> => {
          globalValue = v;
          return Promise.resolve(null);
        };
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(async () => {
          either = Either.right<AppError, number>(value);
          result = await asyncTap(side_effect)
            .apply(null, [either]);
        });

        it(`Should return the original value, so is meant for running functions with side-effects`, () => {
          expectChai(result)
            .to.be.equals(either);
          expectChai(globalValue)
            .to.be.equals(value);
        });
      });
    });
  });
});
