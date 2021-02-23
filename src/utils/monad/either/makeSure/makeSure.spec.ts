import makeSure from './makeSure';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InternalServerError } from 'common/httpErrors';

const ERROR: AppError = new InternalServerError();

describe('utils', () => {
  describe('either', () => {
    describe(`makeSure`, () => {
      let predicate: jest.Mock<boolean, [number]>;
      let spiedRight;
      let spiedLeft;

      beforeAll(() => {
        predicate = jest.fn().mockImplementation((v: number): boolean => v > 0 ? true : false);
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
          makeSure(predicate, ERROR)
            .apply(null, [value]);
        });

        it(`Should call predicate function and create new Either with value in right side`, () => {
          expect(predicate)
            .toHaveBeenCalledTimes(1);
          expect(predicate)
            .toHaveBeenCalledWith(value);
          expect(spiedLeft)
            .toHaveBeenCalledTimes(0);
          expect(spiedRight)
            .toHaveBeenCalledTimes(1);
          expect(spiedRight)
            .toHaveBeenCalledWith(value);
        });
      });

      describe(`Left side`, () => {
        const value: number = -10;
        beforeAll(() => {
          jest.clearAllMocks();
          makeSure(predicate, ERROR)
            .apply(null, [value]);
        });

        it(`Should call predicate function and create new Either with error in left side`, () => {
          expect(predicate)
            .toHaveBeenCalledTimes(1);
          expect(predicate)
            .toHaveBeenCalledWith(value);
          expect(spiedRight)
            .toHaveBeenCalledTimes(0);
          expect(spiedLeft)
            .toHaveBeenCalledTimes(1);
          expect(spiedLeft)
            .toHaveBeenCalledWith(ERROR);
        });
      });
    });
  });
});
