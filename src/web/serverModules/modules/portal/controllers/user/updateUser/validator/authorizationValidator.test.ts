import authorizationValidator from './authorizationValidator';
import { UserBody } from '../updateUser.types';
import { expect as expectChai } from 'chai';
import { NotAuthorized } from 'common/httpErrors';
import { AppError } from 'common/error';
import { UserRole } from 'model/sequelize/model/user/user.types';
import { User as PortalUser } from 'model/sequelize/model/user/user';

const id = 'fe28f5fa-82c4-4f4c-9ef4-49da47164868';
const USER: PortalUser = {
  id,
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe.doe@company.com',
  role: UserRole.Admin,
  active: true
} as PortalUser;
const CURRENT_USER: PortalUser = { id: '2a712c0a-2062-49b7-b2a4-dc4a16426cf5' } as PortalUser;
const BODY: UserBody = {
  role: UserRole.User,
  active: false,
  firstName: 'Jack',
  lastName: 'Black'
};

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Portal', () => {
      describe('controller', () => {
        describe('user controller', () => {
          describe('update user by id', () => {
            describe(`authorization validation`, () => {
              it(`Should return Either with body object in right side, if authorization has passed successfully`, () => {
                authorizationValidator(USER, CURRENT_USER)(BODY)
                  .do({
                    right: (result: UserBody) =>
                      expectChai(result)
                        .to.be.an('object')
                        .which.is.deep.equal(BODY),
                    left: (error: AppError) => fail('Left side has not been expected.' + '\n' + error.code + '\n' + error.message)
                  });
              });

              it(`Should return Either with body object in right side, if body has not fields, which has to be authorized`, () => {
                authorizationValidator(USER, CURRENT_USER)({})
                  .do({
                    right: (result: UserBody) =>
                      expectChai(result)
                        .to.be.an('object')
                        .which.is.deep.equal({}),
                    left: (error: AppError) => fail('Left side has not been expected.' + '\n' + error.code + '\n' + error.message)
                  });
              });
            });

            it(`Should return Either with body object in right side, if user tried change his name`, () => {
              authorizationValidator(USER, USER)({ firstName: 'Jack', lastName: 'Black' })
                .do({
                  right: (result: UserBody) =>
                    expectChai(result)
                      .to.be.an('object')
                      .which.is.deep.equal({ firstName: 'Jack', lastName: 'Black' }),
                  left: (error: AppError) => fail('Left side has not been expected.' + '\n' + error.code + '\n' + error.message)
                });
            });
          });

          describe('Should return Either with authorization error in left side, if user try to update his role', () => {
            it(`role must be value from 'UserRole' enum`, () => {
              authorizationValidator(USER, USER)({ role: UserRole.User })
                .do({
                  right: () => fail('Error \'InvalidInput\' has been expected.'),
                  left: (error: AppError) =>
                    expectChai(error)
                      .to.be.an('error')
                      .that.is.instanceOf(NotAuthorized)
                });
            });

            it(`Should return Either with authorization error in left side, if user try to deactivate himself`, () => {
              authorizationValidator(USER, USER)({ active: false })
                .do({
                  right: () => fail('Error \'InvalidInput\' has been expected.'),
                  left: (error: AppError) =>
                    expectChai(error)
                      .to.be.an('error')
                      .that.is.instanceOf(NotAuthorized)
                });
            });

            it(`Should collect all authorization errors`, () => {
              authorizationValidator(USER, USER)(BODY)
                .do({
                  right: () => fail('Error \'InvalidInput\' has been expected.'),
                  left: (error: AppError) =>
                    expectChai(error.message)
                      .to.be.an('string')
                      .which.is.equal(`Validation failed: ["User cannot activate/deactivate himself","User cannot change his role"]`)
                });
            });
          });
        });
      });
    });
  });
});
