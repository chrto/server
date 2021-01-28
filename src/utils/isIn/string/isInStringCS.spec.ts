import { expect as expectChai } from 'chai';
import isInStringCS from './isInStringCS';

const INPUT_STRING: string = 'random string for test';

describe('utils', () => {
  describe('isIn', () => {
    describe('string [Case Sensitive]', () => {
      it(`Should return 'true', if substring is in string`, () => {
        expectChai(isInStringCS(INPUT_STRING, 'dom'))
          .to.be.an('boolean')
          .which.is.equal(true);
      });
      it(`Should return 'false', if substring is not in string`, () => {
        expectChai(isInStringCS(INPUT_STRING, 'aa'))
          .to.be.an('boolean')
          .which.is.equal(false);
      });
      it(`Should be case sensitive`, () => {
        expectChai(isInStringCS(INPUT_STRING, 'Dom'))
          .to.be.an('boolean')
          .which.is.equal(false);
      });
    });
  });
});
