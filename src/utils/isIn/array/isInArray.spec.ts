import { expect as expectChai } from 'chai';
import isInArray from './isInArray';

const INPUT_ARRAY: any[] = [1, 'a', true];

describe('utils', () => {
  describe('isIn', () => {
    describe('array', () => {
      it(`Should return 'true', if all items in array2 are in array1`, () => {
        expectChai(isInArray<any>(INPUT_ARRAY, ['a', 1]))
          .to.be.an('boolean')
          .which.is.equal(true);
      });
      it(`Should return 'false', if not all items in array2 are in array1`, () => {
        expectChai(isInArray<any>(INPUT_ARRAY, ['a', 2, 1, true]))
          .to.be.an('boolean')
          .which.is.equal(false);
      });
    });
  });
});
