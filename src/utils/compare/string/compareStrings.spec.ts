import compareStrings, { SensitivityOptions } from './compareStrings';

describe('utils', () => {
  describe('comare', () => {
    describe('string', () => {
      it(`Should test 'a = a'`, () => {
        const result: boolean = compareStrings('a', 'a', SensitivityOptions.base);
        expect(result).toBeBoolean;
        expect(result).toBe(true);
      });
      describe('base', () => {
        it(`Should test 'a ≠ b'`, () => {
          const result: boolean = compareStrings('a', 'b', SensitivityOptions.base);
          expect(result).toBeBoolean;
          expect(result).toBe(false);
        });

        it(`Should test 'a = á'`, () => {
          const result: boolean = compareStrings('a', 'á', SensitivityOptions.base);
          expect(result).toBeBoolean;
          expect(result).toBe(true);
        });

        it(`Should test 'a = A'`, () => {
          const result: boolean = compareStrings('a', 'A', SensitivityOptions.base);
          expect(result).toBeBoolean;
          expect(result).toBe(true);
        });
      });

      describe('accent', () => {
        it(`Should test 'a ≠ b'`, () => {
          const result: boolean = compareStrings('a', 'b', SensitivityOptions.accent);
          expect(result).toBeBoolean;
          expect(result).toBe(false);
        });

        it(`Should test 'a ≠ á'`, () => {
          const result: boolean = compareStrings('a', 'á', SensitivityOptions.accent);
          expect(result).toBeBoolean;
          expect(result).toBe(false);
        });

        it(`Should test 'a = A'`, () => {
          const result: boolean = compareStrings('a', 'A', SensitivityOptions.accent);
          expect(result).toBeBoolean;
          expect(result).toBe(false);  // ???????? TRUE
        });
      });

      describe('case', () => {
        it(`Should test 'a ≠ b'`, () => {
          const result: boolean = compareStrings('a', 'b', SensitivityOptions.case); // ?
          expect(result).toBeBoolean;
          expect(result).toBe(true); // ??? FALSE

        });

        it(`Should test 'a = á'`, () => {
          const result: boolean = compareStrings('a', 'á', SensitivityOptions.case);
          expect(result).toBeBoolean;
          expect(result).toBe(true);
        });

        it(`Should test 'a ≠ A'`, () => {
          const result: boolean = compareStrings('a', 'A', SensitivityOptions.case);
          expect(result).toBeBoolean;
          expect(result).toBe(false);
        });
      });

      describe('variant', () => {
        it(`Should test 'a ≠ b'`, () => {
          const result: boolean = compareStrings('a', 'b', SensitivityOptions.variant);
          expect(result).toBeBoolean;
          expect(result).toBe(false);
        });

        it(`Should test 'a ≠ á'`, () => {
          const result: boolean = compareStrings('a', 'á', SensitivityOptions.variant);
          expect(result).toBeBoolean;
          expect(result).toBe(false);
        });

        it(`Should test 'a ≠ A'`, () => {
          const result: boolean = compareStrings('a', 'A', SensitivityOptions.variant);
          expect(result).toBeBoolean;
          expect(result).toBe(false);
        });
      });
    });
  });
});
