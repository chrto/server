import createUserUnbound from './createUser.unbound';
import initUserModel, { User } from 'model/sequelize/user/user';
import { Response } from 'express';
import { UserItems, UserRequired, UserRole } from 'model/sequelize/user/user.types';
import { Sequelize } from 'sequelize';
import { DEFAULT_DB_DIALECT } from 'src/defaults';
import { UserBody } from './createUser.types';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { AppRequest } from 'web/serverModules/types';
import { RequestImplicits } from '../../../paramHandlers/paramHandlers.types';
import { UserService } from 'service/sequelize/userService/userService';
import { Conflict, InvalidInput, NotFound } from 'common/httpErrors';
import bodyValidator from './validator/bodyValidator';
import emailNotExists from './validator/emailNotExists';
import userFactory from 'model/sequelize/user/factory/userFactory';
import { sanitizeEntity } from 'service/sequelize/common/modelHelper';
import { _do } from 'utils/either';
import { expect as expectChai } from 'chai';

type AppReq = AppRequest<unknown, UserBody, User, RequestImplicits>;
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
            let userService: Partial<UserService> = {};
            let createUserExecutor: jest.Mock<Promise<Either<AppError, User>>, [UserRequired]>;
            let getUserExecutor: jest.Mock<Promise<Either<AppError, User>>, [string]>;
            let createUser;
            beforeAll(() => {
              sequelize = new Sequelize(null, null, null, { dialect: DEFAULT_DB_DIALECT });
              initUserModel(sequelize);

              user = User.build(USER_ITEMS);
              res = {
                status: jest.fn().mockReturnThis()
              };

              userService.getUserByEmail = jest.fn().mockImplementation(() => getUserExecutor);
              userService.createUser = jest.fn().mockImplementation(() => createUserExecutor);
              createUser = createUserUnbound
                .apply(null, [bodyValidator, emailNotExists, userFactory, sanitizeEntity])
                .apply(null, [userService]);
            });

            describe('Happy paty', () => {
              beforeAll(() => {
                req = {
                  body: BODY
                } as AppReq;

                createUserExecutor = jest.fn().mockResolvedValue(Either.right(user));
                getUserExecutor = jest.fn().mockResolvedValue(Either.left(new NotFound('')));
              });
              it('Should create new user in DB', () => {
                createUser
                  .apply(null, [null, req, res])
                  .then(_do({
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
                    .then(_do({
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

                  getUserExecutor = jest.fn().mockResolvedValue(Either.right(user));
                });
                it('Should response with exact error, if body validation has not been passed', () => {
                  const ERROR_MESSAGE = `User with email 'joe.doe@company.com' exists!`;
                  createUser
                    .apply(null, [null, req, res])
                    .then(_do({
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
                const ERROR_MESSAGE = `Internal Server Error`;
                beforeAll(() => {
                  req = {
                    body: BODY
                  } as AppReq;

                  createUserExecutor = jest.fn().mockResolvedValue(Either.left(new AppError('error', ERROR_MESSAGE)));
                  getUserExecutor = jest.fn().mockResolvedValue(Either.left(new NotFound('')));
                });
                it('Should response with exact error, if body validation has not been passed', () => {
                  createUser
                    .apply(null, [null, req, res])
                    .then(_do({
                      right: (): void => fail(`Right side has not been expected`),
                      left: (error: AppError) => {
                        expect(error)
                          .toBeInstanceOf(AppError);
                        expect(error.message)
                          .toEqual(ERROR_MESSAGE);
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
