import compareArrays from './compareArrays';

describe('utils', () => {
  describe('comare', () => {
    describe('arrays', () => {
      const ARRAY = [4, '8', true];
      it('Should return true, if array1 and array2 has exactly same items and same order', () => {
        expect(compareArrays<any>(ARRAY, [4, '8', true])).toBeBoolean;
        expect(compareArrays<any>(ARRAY, [4, '8', true])).toBe(true);
      });

      it('Should return true, if array1 and array2 has same items, but diferent order', () => {
        expect(compareArrays<any>(ARRAY, [4, true, '8'])).toBeBoolean;
        expect(compareArrays<any>(ARRAY, [4, true, '8'])).toBe(true);
      });

      it('Should return false, if array1 has same items as array2 and some more', () => {
        expect(compareArrays<any>(ARRAY, [4, true, '8', 3])).toBeBoolean;
        expect(compareArrays<any>(ARRAY, [4, true, '8', 3])).toBe(false);
      });

      it('Should return false, if array1 has same items as array2 but less', () => {
        expect(compareArrays<any>(ARRAY, [4, true])).toBeBoolean;
        expect(compareArrays<any>(ARRAY, [4, true])).toBe(false);
      });
    });
  });
});
