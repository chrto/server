import bodyValidator from './bodyValidator';
import { UserBody } from '../updateUser.types';
import { expect as expectChai } from 'chai';
import { InvalidInput } from 'common/httpErrors';
import { AppError } from 'common/error';
import { UserRole } from 'model/sequelize/user/user.types';

const body: UserBody = {
  role: UserRole.Admin,
  active: true
};

describe(`Test 'userBodyValidatorPATCH' module`, () => {
  describe(`success test cases`, () => {
    it(`should return body object, if everithing pass well`, () => {
      bodyValidator(body)
        .do({
          right: (result: UserBody) =>
            expectChai(result)
              .to.be.an('object')
              .which.is.deep.equal(body),
          left: (error: AppError) => fail('Left side has not been expected.' + '\n' + error.code + '\n' + error.message)
        });
    });

    it(`body may be empty object`, () => {
      bodyValidator({})
        .do({
          right: (result: UserBody) =>
            expectChai(result)
              .to.be.an('object')
              .which.is.deep.equal({}),
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
            expectChai(error)
              .to.be.an('error')
              .that.is.instanceOf(InvalidInput)
        });
    });

    it(`active must be boolean value`, () => {
      bodyValidator({ ...body, active: '3' as unknown as boolean })
        .do({
          right: () => fail('Error \'InvalidInput\' has been expected.'),
          left: (error: AppError) =>
            expectChai(error)
              .to.be.an('error')
              .that.is.instanceOf(InvalidInput)
        });
    });

    it(`Should collect all validation errors`, () => {
      bodyValidator({ ...body, role: 'aaaa' as UserRole, active: '3' as unknown as boolean })
        .do({
          right: () => fail('Error \'InvalidInput\' has been expected.'),
          left: (error: AppError) =>
            expectChai(error.message)
              .to.be.an('string')
              .which.is.equal(`Validation failed: ["Invalid user role","'active' parameter must be boolean"]`)

        });
    });
  });
});
