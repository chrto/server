import { expect as expectChai } from 'chai';
import compareArrays from './compareArrays';

describe('utils', () => {
  describe('comare', () => {
    describe('arrays', () => {
      const ARRAY = [4, '8', true];
      it('Should return true, if array1 and array2 has exactly same items and same order', () => {
        expectChai(compareArrays<any>(ARRAY, [4, '8', true]))
          .to.be.an('boolean')
          .which.is.equal(true);
      });

      it('Should return true, if array1 and array2 has same items, but diferent order', () => {
        expectChai(compareArrays<any>(ARRAY, [4, true, '8']))
          .to.be.an('boolean')
          .which.is.equal(true);
      });

      it('Should return false, if array1 has same items as array2 and some more', () => {
        expectChai(compareArrays<any>(ARRAY, [4, true, '8', 3]))
          .to.be.an('boolean')
          .which.is.equal(false);
      });

      it('Should return false, if array1 has same items as array2 but less', () => {
        expectChai(compareArrays<any>(ARRAY, [4, true]))
          .to.be.an('boolean')
          .which.is.equal(false);
      });
    });
  });
});
