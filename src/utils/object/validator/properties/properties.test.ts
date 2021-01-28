import { expect as expectChai } from 'chai';
import { NotAuthorized } from 'common/httpErrors';
import { isEnum, isMissing, isNumber, isString } from 'utils/validation';
import { Validator } from './properties.types';
import propertiesUnbound, { check } from './properties.unbound';

enum Enum {
  choice01 = 'a',
  choice02 = 'b'
}
const OBJ_WRONG: any = Object.freeze({
  a: 'bla',
  n: true,
  e: 'foo'
});
const OBJ: any = Object.freeze({
  a: 'value',
  n: 5,
  e: Enum.choice01
});

const PARAM_CHECKS: Validator<any>[] = [
  check((obj: any): boolean => isString(obj.a), `Item 'a' MUST BE a string`),
  check((obj: any): boolean => obj.a === 'value', (obj) => `${obj.a} is not valid value`),
  check((obj: any): boolean => isNumber(obj.n) && obj.n === 5, ['must be an number', 'must be equal 5']),
  check((obj: any): boolean => isEnum(Enum)(obj.e), 'is not from Enum')
];

describe('utils', () => {
  describe('object', () => {
    describe('object properties validator', () => {
      let properties;

      beforeAll(() => {
        properties = propertiesUnbound
          .apply(null, [isMissing]);
      })

      it(`Should return Either with validated object in right side, if validation has been passed`, () => {
        properties
          .apply(null, [PARAM_CHECKS])
          .apply(null, [OBJ])
          .do({
            right: (obj: any) =>
              expectChai(obj)
                .is.an('object')
                .which.is.deep.equal(OBJ),
            left: (error) => fail(`Left side has not been expected: ${error.message}`)
          });
      });

      it(`Should return Either with exact error in left side, if validation has not been passed`, () => {
        properties
          .apply(null, [PARAM_CHECKS, NotAuthorized])
          .apply(null, [OBJ_WRONG])
          .do({
            right: () => fail(`Right side has not been expected`),
            left: (error) => {
              expectChai(error)
                .to.be.instanceOf(NotAuthorized);
              expectChai(error.message)
                .to.be.equal(`Validation failed: ["bla is not valid value","must be an number","must be equal 5","is not from Enum"]`)
            }
          });
      });
    });
  });
});
