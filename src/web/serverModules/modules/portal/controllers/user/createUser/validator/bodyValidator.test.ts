import bodyValidator from './bodyValidator';

import { UserBody } from '../createUser.types';
import { AppError } from 'common/error';
import { UserRole } from 'model/sequelize/user/user.types';
import { expect as expectChai } from 'chai';
import { InvalidInput } from 'common/httpErrors';

const BODY: UserBody = {
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe.doe@company.com',
  role: UserRole.Admin,
  active: true
};

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Portal', () => {
      describe('controller', () => {
        describe('user controller', () => {
          describe('create user', () => {
            describe('body validator', () => {
              it(`Should return Either with body object in right side`, () => {
                bodyValidator(BODY)
                  .do({
                    right: (body: UserBody) =>
                      expectChai(body)
                        .to.be.an({}.constructor.name)
                        .which.is.deep.equal(BODY),
                    left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
                  });
              });

              it(`only 'email', 'firstName' and 'lastName' items are mandatory`, () => {
                const mandatory: UserBody = { email: BODY.email, firstName: BODY.firstName, lastName: BODY.lastName };
                bodyValidator(mandatory)
                  .do({
                    right: (body: UserBody) =>
                      expectChai(body)
                        .to.be.an('object')
                        .which.is.deep.equal(mandatory),
                    left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
                  });
              });

              it(`Should have mandatory fields`, () => {
                const ERROR_MESSAGE: string = 'following required properties are missing in request: email, firstName, lastName';
                bodyValidator({})
                  .do({
                    right: (): void => fail(`Right side has not been expected`),
                    left: (error: AppError) => {
                      expect(error)
                        .toBeInstanceOf(InvalidInput);
                      expect(error.message)
                        .toEqual(ERROR_MESSAGE);
                    }
                  });
              });

              it(`email must be specify`, () => {
                const ERROR_MESSAGE: string = 'Validation failed: ["Missing mandatory property email"]';
                bodyValidator({ ...BODY, email: '' })
                  .do({
                    right: (): void => fail(`Right side has not been expected`),
                    left: (error: AppError) => {
                      expect(error)
                        .toBeInstanceOf(InvalidInput);
                      expect(error.message)
                        .toEqual(ERROR_MESSAGE);
                    }
                  });
              });

              it(`firstName must be specify`, () => {
                const ERROR_MESSAGE: string = 'Validation failed: ["Missing mandatory property firstName"]';
                bodyValidator({ ...BODY, firstName: '' })
                  .do({
                    right: (): void => fail(`Right side has not been expected`),
                    left: (error: AppError) => {
                      expect(error)
                        .toBeInstanceOf(InvalidInput);
                      expect(error.message)
                        .toEqual(ERROR_MESSAGE);
                    }
                  });
              });

              it(`lastName must be specify`, () => {
                const ERROR_MESSAGE: string = 'Validation failed: ["Missing mandatory property lastName"]';
                bodyValidator({ ...BODY, lastName: '' })
                  .do({
                    right: (): void => fail(`Right side has not been expected`),
                    left: (error: AppError) => {
                      expect(error)
                        .toBeInstanceOf(InvalidInput);
                      expect(error.message)
                        .toEqual(ERROR_MESSAGE);
                    }
                  });
              });

              it(`email must be valid`, () => {
                const ERROR_MESSAGE: string = 'Validation failed: ["Email address is not valid"]';
                bodyValidator({ ...BODY, email: 'foo' })
                  .do({
                    right: (): void => fail(`Right side has not been expected`),
                    left: (error: AppError) => {
                      expect(error)
                        .toBeInstanceOf(InvalidInput);
                      expect(error.message)
                        .toEqual(ERROR_MESSAGE);
                    }
                  });
              });

              it(`role must be value from 'UserRole' enum`, () => {
                const ERROR_MESSAGE: string = 'Validation failed: ["Invalid user role"]';
                bodyValidator({ ...BODY, role: 'aaaa' as UserRole })
                  .do({
                    right: (): void => fail(`Right side has not been expected`),
                    left: (error: AppError) => {
                      expect(error)
                        .toBeInstanceOf(InvalidInput);
                      expect(error.message)
                        .toEqual(ERROR_MESSAGE);
                    }
                  });
              });

              it(`active must be boolean value`, () => {
                const ERROR_MESSAGE: string = `Validation failed: ["'active' parameter must be boolean"]`;
                bodyValidator({ ...BODY, active: '3' as unknown as boolean })
                  .do({
                    right: (): void => fail(`Right side has not been expected`),
                    left: (error: AppError) => {
                      expect(error)
                        .toBeInstanceOf(InvalidInput);
                      expect(error.message)
                        .toEqual(ERROR_MESSAGE);
                    }
                  });
              });
            });
          });
        });
      });
    });
  });
});
