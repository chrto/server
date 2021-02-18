import eitherify from './eitherify';
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
      let spiedRight;
      let spiedLeft;

      beforeAll(() => {
        spiedRight = jest.spyOn(Either, 'right');
        spiedLeft = jest.spyOn(Either, 'left');
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Right side`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();
          eitherify(func)
            .apply(null, [value]);
        });

        it(`Should create new Either monad with value in right side, if value has been returned`, () => {
          expect(spiedRight)
            .toHaveBeenCalledTimes(1);
          expect(spiedRight)
            .toHaveBeenCalledWith(value);
          expect(spiedLeft)
            .toHaveBeenCalledTimes(0);
        });
      });

      describe(`Left side`, () => {
        const value: number = -10;
        beforeAll(() => {
          jest.clearAllMocks();
          eitherify(func)
            .apply(null, [value]);
        });

        it(`Should create new Either monad with error in left side, if error has been thrown`, () => {
          expect(spiedLeft)
            .toHaveBeenCalledTimes(1);
          expect(spiedLeft)
            .toHaveBeenCalledWith(new AppError('', ERROR_MESSAGE));
          expect(spiedRight)
            .toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});
