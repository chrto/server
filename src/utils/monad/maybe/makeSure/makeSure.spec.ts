import makeSure from './makeSure';
import { Maybe } from 'tsmonad';

describe('abstractions', () => {
  describe('maybe', () => {
    describe(`makeSure`, () => {
      let predicate: jest.Mock<boolean, [number]>;
      let spiedJust;
      let spiedNothing;

      beforeAll(() => {
        predicate = jest.fn().mockImplementation((v: number): boolean => v > 0 ? true : false);
        spiedJust = jest.spyOn(Maybe, 'just');
        spiedNothing = jest.spyOn(Maybe, 'nothing');
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      describe(`Mayby just`, () => {
        const value: number = 10;
        beforeAll(() => {
          jest.clearAllMocks();
          makeSure(predicate)
            .apply(null, [value]);
        });

        it(`Should call predicate function and create new Maybe with value`, () => {
          expect(predicate)
            .toHaveBeenCalledTimes(1);
          expect(predicate)
            .toHaveBeenCalledWith(value);
          expect(spiedNothing)
            .toHaveBeenCalledTimes(0);
          expect(spiedJust)
            .toHaveBeenCalledTimes(1);
          expect(spiedJust)
            .toHaveBeenCalledWith(value);
        });
      });

      describe(`Maybe nothing`, () => {
        const value: number = -10;
        beforeAll(() => {
          jest.clearAllMocks();
          makeSure(predicate)
            .apply(null, [value]);
        });

        it(`Should call predicate function and create new Maybe with nothing`, () => {
          expect(predicate)
            .toHaveBeenCalledTimes(1);
          expect(predicate)
            .toHaveBeenCalledWith(value);
          expect(spiedJust)
            .toHaveBeenCalledTimes(0);
          expect(spiedNothing)
            .toHaveBeenCalledTimes(1);
          expect(spiedNothing)
            .toHaveBeenCalledWith();
        });
      });
    });
  });
});
