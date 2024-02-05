import { isUndefined, isMissing, trimmer, isInArray, isNotInArray, isString, isNumber, isObject, isArray, isEnum, isRegExp, isSetTrue } from './validation';

describe('Test `validation` module.', () => {
  describe('Test `isUndefined` function', () => {
    it('should return `true` if value is `null`', () => {
      expect(isUndefined(null)).toBe(true);
    });

    it('should return `true` if value is `undefined`', () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    it('should return `false` if value', () => {
      expect(isUndefined('')).toBe(false);
    });
  });

  describe('Test `isMissing` function', () => {
    it('should return `true` if value is empty string', () => {
      expect(isMissing('')).toBe(true);
    });

    it('should return `false` if value is not empty string', () => {
      expect(isMissing('not empty')).toBe(false);
    });
  });

  describe('Test `trimmer` function', () => {
    it('should return string without leading and trailing white space', () => {
      const input = `
            test `;
      const expected = 'test';
      expect(trimmer(input)).toBe(expected);
    });
  });

  describe('Test `isInArray` function', () => {
    it('should return `true`, if item is in array', () => {
      const input = ['a', 'b', 'c'];
      expect(isInArray(input)('a')).toBe(true);
    });

    it('should return `false`, if item is not in array', () => {
      const input = ['a', 'b', 'c'];
      expect(isInArray(input)('z')).toBe(false);
    });
  });

  describe('Test `isNotInArray` function', () => {
    it('should return `true`, if item is not in array', () => {
      const input = ['a', 'b', 'c'];
      expect(isNotInArray(input)('z')).toBe(true);
    });

    it('should return `false`, if item is in array', () => {
      const input = ['a', 'b', 'c'];
      expect(isNotInArray(input)('a')).toBe(false);
    });
  });

  describe('Test `isString` function', () => {
    it('should retrun `true` if value is string', () => {
      expect(isString('string')).toBe(true);
    });

    it('should retrun `false` if value is not string', () => {
      expect(isString(5)).toBe(false);
    });
  });

  describe('Test `isNumber` function', () => {
    it('should retrun `true` if value is number', () => {
      expect(isNumber(5)).toBe(true);
    });

    it('should retrun `false` if value is not number', () => {
      expect(isNumber('5')).toBe(false);
    });
  });

  describe('Test `isObject` function', () => {
    it('should retrun `true` if value is object', () => {
      expect(isObject({a: 'a'})).toBe(true);
    });

    it('should retrun `false` if value is not object', () => {
      expect(isObject('5')).toBe(false);
    });
  });

  describe('Test `isArray` function', () => {
    it('should retrun `true` if value is array', () => {
      expect(isArray([3, 5, 'a'])).toBe(true);
    });

    it('should retrun `false` if value is not array', () => {
      expect(isArray('5')).toBe(false);
    });
  });

  describe('Test `isEnum` function', () => {
    it('should retrun `true` if value is Enum', () => {
      expect(isEnum({a: 'a', b: 'b'})('a')).toBe(true);
    });

    it('should retrun `false` if value is not Enum', () => {
      expect(isEnum({a: 'a', b: 'b'})('m')).toBe(false);
    });
  });

  describe('Test `isRegExp` function', () => {
    it('should retrun `true` if value match regexp', () => {
      expect(isRegExp(/^https/)('https://login.microsoftonline.com')).toBe(true);
    });

    it('should retrun `false` if value not match regexp', () => {
      expect(isRegExp(/^https/)('http://login.microsoftonline.com')).toBe(false);
    });
  });

  describe('Test `isSetTrue` function', () => {
    it('should retrun `true` if value is `true`', () => {
      expect(isSetTrue('true')).toBe(true);
    });

    it('should retrun `true` if value is `1`', () => {
      expect(isSetTrue('1')).toBe(true);
    });

    it('should retrun `false` otherwise', () => {
      expect(isSetTrue('other')).toBe(false);
    });
  });
});
