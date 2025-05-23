import bodyValidator from './bodyValidator';
import { UserBody } from '../updateUser.types';
import { InvalidInput } from 'common/httpErrors';
import { AppError } from 'common/error';
import { UserRole } from 'model/sequelize/model/user/user.types';

const body: UserBody = {
  role: UserRole.Admin,
  active: true
};

describe(`Test 'userBodyValidatorPATCH' module`, () => {
  describe(`success test cases`, () => {
    it(`should return body object, if everithing pass well`, () => {
      bodyValidator(body)
        .do({
          right: (result: UserBody) => {
            expect(result).toBeObject;
            expect(result).toStrictEqual(body);
          },
          left: (error: AppError) => fail('Left side has not been expected.' + '\n' + error.code + '\n' + error.message)
        });
    });

    it(`body may be empty object`, () => {
      bodyValidator({})
        .do({
          right: (result: UserBody) => {
            expect(result).toBeObject;
            expect(result).toStrictEqual({});
          },
          left: (error: AppError) => fail('Left side has not been expected.' + '\n' + error.code + '\n' + error.message)
        });
    });
  });

  describe('failed test cases', () => {
    it(`role must be value from 'UserRole' enum`, () => {
      bodyValidator({ ...body, role: 'aaaa' as UserRole })
        .do({
          right: () => fail('Error \'InvalidInput\' has been expected.'),
          left: (error: AppError) =>
            expect(error).toBeInstanceOf(InvalidInput)
        });
    });

    it(`active must be boolean value`, () => {
      bodyValidator({ ...body, active: '3' as unknown as boolean })
        .do({
          right: () => fail('Error \'InvalidInput\' has been expected.'),
          left: (error: AppError) =>
            expect(error).toBeInstanceOf(InvalidInput)
        });
    });

    it(`Should collect all validation errors`, () => {
      bodyValidator({ ...body, role: 'aaaa' as UserRole, active: '3' as unknown as boolean })
        .do({
          right: () => fail('Error \'InvalidInput\' has been expected.'),
          left: (error: AppError) =>
            expect(error.message).toEqual(`Validation failed: ["Invalid user role","'active' parameter must be boolean"]`)
        });
    });
  });
});
