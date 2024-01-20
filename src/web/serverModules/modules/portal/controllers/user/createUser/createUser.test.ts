import createUserUnbound from './createUser.unbound';
import doer from 'utils/monad/either/do/doer';
import appLogger from 'logger/appLogger';
import userService from 'service/sequelize/userService/userService';
import initUserModel, { User } from 'model/sequelize/model/user/user';
import { Response } from 'express';
import { UserItems, UserRequired, UserRole } from 'model/sequelize/model/user/user.types';
import { Sequelize, UniqueConstraintError } from 'sequelize';
import { DEFAULT_DB_DIALECT } from 'src/defaults';
import { UserBody } from './createUser.types';
import { AppError } from 'common/error';
import { AppRequest } from 'web/serverModules/types';
import { RequestImplicits } from '../../../paramHandlers/paramHandlers.types';
import { Conflict, InvalidInput } from 'common/httpErrors';
import bodyValidator from './validator/bodyValidator';
import emailNotExists from './validator/emailNotExists';
import userFactory from 'model/sequelize/model/user/factory/userFactory';
import { expect as expectChai } from 'chai';
import sanitizeModel from 'model/sequelize/sanitizeModel/sanitizeModel';

type AppReq = AppRequest<User, RequestImplicits, unknown, UserBody>;
const UUID: string = '92b814ed-1aff-46c1-b669-0c9fd2ea81a3';
const USER_REQUIRED: UserRequired = {
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe.doe@company.com'
};

const BODY: UserBody = USER_REQUIRED;

const USER_ITEMS: UserItems = {
  id: UUID,
  active: true,
  role: UserRole.User,
  ...USER_REQUIRED
};

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Portal', () => {
      describe('controller', () => {
        describe('user controller', () => {
          describe('create user', () => {
            let res: Partial<Response>;
            let req: AppReq;

            let sequelize: Sequelize;
            let user: User;
            let createUser;
            beforeAll(() => {
              appLogger.error = (_) => appLogger; // disable logger
              sequelize = new Sequelize(null, null, null, { dialect: DEFAULT_DB_DIALECT });
              initUserModel(sequelize);

              user = User.build(USER_ITEMS);
              res = {
                status: jest.fn().mockReturnThis()
              };

              createUser = createUserUnbound
                .apply(null, [bodyValidator, emailNotExists, userFactory, sanitizeModel])
                .apply(null, [userService()]);
            });

            describe('Happy paty', () => {
              beforeAll(() => {
                req = {
                  body: BODY
                } as AppReq;

                User.create = jest.fn().mockResolvedValue(user);
                User.findOne = jest.fn().mockResolvedValue(null);
              });
              it('Should create new user in DB', () => {
                createUser
                  .apply(null, [null, req, res])
                  .then(doer({
                    right: (result: User) =>
                      expectChai(result)
                        .to.be.an({}.constructor.name)
                        .which.is.deep.equal(user.get({})),
                    left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
                  }));
              });
            });

            describe('Error paty', () => {
              describe('Body validation', () => {
                beforeAll(() => {
                  req = {
                    body: { ...BODY, firstName: '' }
                  } as AppReq;
                });
                it('Should response with exact error, if body validation has not been passed', () => {
                  const ERROR_MESSAGE = 'Validation failed: ["Missing mandatory property firstName"]';
                  createUser
                    .apply(null, [null, req, res])
                    .then(doer({
                      right: (): void => fail(`Right side has not been expected`),
                      left: (error: AppError) => {
                        expect(error)
                          .toBeInstanceOf(InvalidInput);
                        expect(error.message)
                          .toEqual(ERROR_MESSAGE);
                      }
                    }));
                });
              });

              describe('Email validation', () => {
                beforeAll(() => {
                  req = {
                    body: BODY
                  } as AppReq;
                  User.findOne = jest.fn().mockResolvedValue(user);
                });
                it('Should response with exact error, if body validation has not been passed', () => {
                  const ERROR_MESSAGE = `User with email 'joe.doe@company.com' exists!`;
                  createUser
                    .apply(null, [null, req, res])
                    .then(doer({
                      right: (): void => fail(`Right side has not been expected`),
                      left: (error: AppError) => {
                        expect(error)
                          .toBeInstanceOf(Conflict);
                        expect(error.message)
                          .toEqual(ERROR_MESSAGE);
                      }
                    }));
                });
              });
              describe('Email validation', () => {
                const ERROR_MESSAGE = `email exists`;
                beforeAll(() => {
                  req = {
                    body: BODY
                  } as AppReq;

                  User.create = jest.fn().mockRejectedValue(new UniqueConstraintError({ message: ERROR_MESSAGE, errors: [] }));
                  User.findOne = jest.fn().mockResolvedValue(null);
                });
                it('Should response with exact error, if body validation has not been passed', () => {
                  createUser
                    .apply(null, [null, req, res])
                    .then(doer({
                      right: (): void => fail(`Right side has not been expected`),
                      left: (error: AppError) => {
                        expect(error)
                          .toBeInstanceOf(Conflict);
                        expect(error.message)
                          .toEqual(`message: ${ERROR_MESSAGE}${'\n'}`);
                      }
                    }));
                });
              });
            });
          });
        });
      });
    });
  });
});
