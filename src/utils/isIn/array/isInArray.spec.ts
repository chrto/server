import isInArray from './isInArray';

const INPUT_ARRAY: any[] = [1, 'a', true];

describe('utils', () => {
  describe('isIn', () => {
    describe('array', () => {
      it(`Should return 'true', if all items in array2 are in array1`, () => {
        const result: boolean = isInArray<any>(INPUT_ARRAY, ['a', 1]);
        expect(result).toBeBoolean;
        expect(result).toBe(true);
      });
      it(`Should return 'false', if not all items in array2 are in array1`, () => {
        const result: boolean = isInArray<any>(INPUT_ARRAY, ['a', 2, 1, true]);
        expect(result).toBeBoolean;
        expect(result).toBe(false);
      });
    });
  });
});
