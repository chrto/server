import hasRequiredFieldsUnbound from './requiredProperties.unbound';
import { isNotInArray } from 'utils/validation';
import { InvalidInput, NotAuthorized } from 'common/httpErrors';

const OBJ: any = Object.freeze({
  a: 'a value',
  n: 5
});
const REQUIRED_FIELDS: string[] = ['a', 'b'];

describe('utils', () => {
  describe('object', () => {
    describe('has required fields', () => {
      let hasRequiredFields;
      beforeAll(() => {
        hasRequiredFields = hasRequiredFieldsUnbound
          .apply(null, [isNotInArray]);
      });

      it(`Should return Either with the object in right side, if validation has been passed`, () => {
        const obj: any = Object.freeze({ ...OBJ, b: {} });
        hasRequiredFields
          .apply(null, [REQUIRED_FIELDS])
          .apply(null, [obj])
          .do({
            right: (result: any) => {
              expect(result).toBeObject;
              expect(result).toStrictEqual(obj);
            },
            left: (error) => fail(`Left side has not been expected: ${error.message}`)
          });
      });

      it(`Should return Either with exact error in left side, if validation has not been passed`, () => {
        hasRequiredFields
          .apply(null, [REQUIRED_FIELDS, NotAuthorized])
          .apply(null, [OBJ])
          .do({
            right: () => fail(`Right side has not been expected`),
            left: (error) => {
              expect(error).toBeInstanceOf(NotAuthorized);
              expect(error.message).toEqual('following required properties are missing in request: b');
            }
          });
      });

      it(`Should return Either with default error in left side, if validation has not been passed and error has not been specified`, () => {
        hasRequiredFields
          .apply(null, [REQUIRED_FIELDS])
          .apply(null, [OBJ])
          .do({
            right: () => fail(`Right side has not been expected`),
            left: (error) => {
              expect(error).toBeInstanceOf(InvalidInput);
              expect(error.message).toEqual('following required properties are missing in request: b');
            }
          });
      });
    });
  });
});
