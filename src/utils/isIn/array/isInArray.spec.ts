import isInArray from './isInArray';

const INPUT_ARRAY: any[] = [1, 'a', true];

describe('utils', () => {
  describe('isIn', () => {
    describe('array', () => {
      it(`Should return 'true', if all items in array2 are in array1`, () => {
        const result: boolean = isInArray<any>(INPUT_ARRAY, ['a', 1]);
        expect(typeof result).toBe('boolean');
        expect(result).toBe(true);
      });
      it(`Should return 'false', if not all items in array2 are in array1`, () => {
        const result: boolean = isInArray<any>(INPUT_ARRAY, ['a', 2, 1, true]);
        expect(typeof result).toBe('boolean');
        expect(result).toBe(false);
      });
    });
  });
});
