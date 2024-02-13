import isInStringCI from './isInStringCI';

const INPUT_STRING: string = 'random string for test';

describe('utils', () => {
  describe('isIn', () => {
    describe('string [Case Insensitive]', () => {
      it(`Should return 'true', if substring is in string`, () => {
        const result: boolean = isInStringCI(INPUT_STRING, 'dom');
        expect(result).toBeBoolean;
        expect(result).toBe(true);
      });
      it(`Should return 'false', if substring is not in string`, () => {
        const result: boolean = isInStringCI(INPUT_STRING, 'aa');
        expect(result).toBeBoolean;
        expect(result).toBe(false);
      });
      it(`Should be case insensitive`, () => {
        const result: boolean = isInStringCI(INPUT_STRING, 'Dom');
        expect(result).toBeBoolean;
        expect(result).toBe(true);
      });
    });
  });
});
