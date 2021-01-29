import { expect, assert as assertChai } from 'chai';
import { UserBodyPOST } from './types';
import userBodyValidatorPOST from './userBodyValidatorPOST';
import { InvalidInput } from 'common/httpErrors';
import { AppError } from 'common/error';
import { UserRole } from 'model/sequelize/user/user.types';

const body: UserBodyPOST = {
  email: 'jon.doe@company.com',
  role: UserRole.Admin,
  active: true
} as UserBodyPOST;

describe(`Test 'userBodyValidatorPOST' module`, () => {
  describe(`success test cases`, () => {
    it(`should return body object, if everithing pass well`, () => {
      userBodyValidatorPOST(body)
        .do({
          right: (result: UserBodyPOST) => {
            expect(result)
              .to.be.an('object')
              .which.is.deep.equal(body);
          },
          left: (error: AppError) => assertChai
            .fail(null, null, 'Left side was not expected.' + '\n' + error.code + '\n' + error.message)
        });
    });

    it(`only email item is mandatory`, () => {
      userBodyValidatorPOST({ email: body.email } as UserBodyPOST)
        .do({
          right: (result: UserBodyPOST) => {
            expect(result)
              .to.be.an('object')
              .which.is.deep.equal({ email: body.email });
          },
          left: (error: AppError) => assertChai
            .fail(null, null, 'Left side was not expected.' + '\n' + error.code + '\n' + error.message)
        });
    });
  });

  describe('failed test cases', () => {
    it(`should have mandatory fields`, () => {
      userBodyValidatorPOST({} as UserBodyPOST)
        .do({
          right: () => assertChai
            .fail(null, null, 'Error \'InvalidInput\' was expected.'),
          left: (error: AppError) => {
            expect(error)
              .to.be.an('error')
              .that.is.instanceOf(InvalidInput);
          }
        });
    });

    it(`email must be specify`, () => {
      userBodyValidatorPOST({ ...body, email: '' })
        .do({
          right: () => assertChai
            .fail(null, null, 'Error \'InvalidInput\' was expected.'),
          left: (error: AppError) => {
            expect(error)
              .to.be.an('error')
              .that.is.instanceOf(InvalidInput);
          }
        });
    });

    it(`role must be value from 'UserRole' enum`, () => {
      userBodyValidatorPOST({ ...body, role: 'aaaa' as UserRole })
        .do({
          right: () => assertChai
            .fail(null, null, 'Error \'InvalidInput\' was expected.'),
          left: (error: AppError) => {
            expect(error)
              .to.be.an('error')
              .that.is.instanceOf(InvalidInput);
          }
        });
    });

    it(`active must be boolean value`, () => {
      userBodyValidatorPOST({ ...body, active: '3' as unknown as boolean })
        .do({
          right: () => assertChai
            .fail(null, null, 'Error \'InvalidInput\' was expected.'),
          left: (error: AppError) => {
            expect(error)
              .to.be.an('error')
              .that.is.instanceOf(InvalidInput);
          }
        });
    });
  });
});
