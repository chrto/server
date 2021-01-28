import { expect as expectChai } from 'chai';
import compareStrings, { SensitivityOptions } from './compareStrings';

describe('utils', () => {
  describe('comare', () => {
    describe('string', () => {
      it(`Should test 'a = a'`, () => {
        expectChai(compareStrings('a', 'a', SensitivityOptions.base))
          .to.be.an('boolean')
          .which.is.equal(true);
      });
      describe('base', () => {
        it(`Should test 'a ≠ b'`, () => {
          expectChai(compareStrings('a', 'b', SensitivityOptions.base))
            .to.be.an('boolean')
            .which.is.equal(false);
        });

        it(`Should test 'a = á'`, () => {
          expectChai(compareStrings('a', 'á', SensitivityOptions.base))
            .to.be.an('boolean')
            .which.is.equal(true);
        });

        it(`Should test 'a = A'`, () => {
          expectChai(compareStrings('a', 'A', SensitivityOptions.base))
            .to.be.an('boolean')
            .which.is.equal(true);
        });
      });

      describe('accent', () => {
        it(`Should test 'a ≠ b'`, () => {
          expectChai(compareStrings('a', 'b', SensitivityOptions.accent))
            .to.be.an('boolean')
            .which.is.equal(false);
        });

        it(`Should test 'a ≠ á'`, () => {
          expectChai(compareStrings('a', 'á', SensitivityOptions.accent))
            .to.be.an('boolean')
            .which.is.equal(false);
        });

        it(`Should test 'a = A'`, () => {
          expectChai(compareStrings('a', 'A', SensitivityOptions.accent))
            .to.be.an('boolean')
            .which.is.equal(true);
        });
      });

      describe('case', () => {
        it(`Should test 'a ≠ b'`, () => {
          expectChai(compareStrings('a', 'b', SensitivityOptions.case))
            .to.be.an('boolean')
            .which.is.equal(false);
        });

        it(`Should test 'a = á'`, () => {
          expectChai(compareStrings('a', 'á', SensitivityOptions.case))
            .to.be.an('boolean')
            .which.is.equal(true);
        });

        it(`Should test 'a ≠ A'`, () => {
          expectChai(compareStrings('a', 'A', SensitivityOptions.case))
            .to.be.an('boolean')
            .which.is.equal(false);
        });
      });

      describe('variant', () => {
        it(`Should test 'a ≠ b'`, () => {
          expectChai(compareStrings('a', 'b', SensitivityOptions.variant))
            .to.be.an('boolean')
            .which.is.equal(false);
        });

        it(`Should test 'a ≠ á'`, () => {
          expectChai(compareStrings('a', 'á', SensitivityOptions.variant))
            .to.be.an('boolean')
            .which.is.equal(false);
        });

        it(`Should test 'a ≠ A'`, () => {
          expectChai(compareStrings('a', 'A', SensitivityOptions.variant))
            .to.be.an('boolean')
            .which.is.equal(false);
        });
      });
    });
  });
});
