import { expect as expectChai } from 'chai';
import isInStringCI from './isInStringCI';

const INPUT_STRING: string = 'random string for test';

describe('utils', () => {
  describe('isIn', () => {
    describe('string [Case Insensitive]', () => {
      it(`Should return 'true', if substring is in string`, () => {
        expectChai(isInStringCI(INPUT_STRING, 'dom'))
          .to.be.an('boolean')
          .which.is.equal(true);
      });
      it(`Should return 'false', if substring is not in string`, () => {
        expectChai(isInStringCI(INPUT_STRING, 'aa'))
          .to.be.an('boolean')
          .which.is.equal(false);
      });
      it(`Should be case insensitive`, () => {
        expectChai(isInStringCI(INPUT_STRING, 'Dom'))
          .to.be.an('boolean')
          .which.is.equal(true);
      });
    });
  });
});
