import { Conflict, InvalidInput } from 'common/httpErrors';

import { parseJSON, parseNumber } from './parse';

describe('Test `Parse` module.', () => {

  describe('parseNumber tests.', () => {

    it('should parse numeric input to number', () => {
      parseNumber('1').do({
        right: (value) => expect(value).toBeNumber
      });
    });

    it('should correctly parse string \'3\' to number 3', () => {
      parseNumber('3').do({
        right: (value) => expect(value).toBe(3)
      });
    });

    it('should return InvalidInput error by default, if input is not numeric', () => {
      parseNumber('notNumber').do({
        left: (err) => expect(err).toBeInstanceOf(InvalidInput)
      });
    });

    it('should return desired error, if input is not numeric', () => {
      parseNumber('notNumber', new Conflict('Desired error')).do({
        left: (err) => expect(err).toBeInstanceOf(Conflict)
      });
    });
  });

  describe('parseJSON tests', () => {

    it('should correctly parse simple json object', () => {
      const TEST_OBJECT = {
        'menu': {
          'id': 'file',
          'value': 'File',
          'popup': {
            'menuitem': [
              { 'value': 'Close', 'onclick': 'CloseDoc()' }
            ]
          }
        }
      };
      const TEST_OBJECT_STR = JSON.stringify(TEST_OBJECT);

      parseJSON(TEST_OBJECT_STR).do({
        right: value => expect(value).toStrictEqual(TEST_OBJECT)
      });
    });

    it('should raise exception in bad json data', () => {
      const BAD_JSON = '#JSON DO NOT HAVE COMMENTS';

      parseJSON(BAD_JSON).do({
        left: err => expect(err).toBeInstanceOf(InvalidInput)
      });
    });
  });
});
