import isInStringCS from './isInStringCS';

const INPUT_STRING: string = 'random string for test';

describe('utils', () => {
  describe('isIn', () => {
    describe('string [Case Sensitive]', () => {
      it(`Should return 'true', if substring is in string`, () => {
        const result: boolean = isInStringCS(INPUT_STRING, 'dom');
        expect(result).toBeBoolean;
        expect(result).toBe(true);
      });
      it(`Should return 'false', if substring is not in string`, () => {
        const result: boolean = isInStringCS(INPUT_STRING, 'aa');
        expect(result).toBeBoolean;
        expect(result).toBe(false);
      });
      it(`Should be case sensitive`, () => {
        const result: boolean = isInStringCS(INPUT_STRING, 'Dom');
        expect(result).toBeBoolean;
        expect(result).toBe(false);
      });
    });
  });
});
