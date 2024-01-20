import updateUserUnbound from './updateUser.unbound';
import userService from 'service/sequelize/userService/userService';
import appLogger from 'logger/appLogger';
import bodyValidator from './validator/bodyValidator';
import authorizationValidator from './validator/authorizationValidator';
import userFactory from 'model/sequelize/model/user/factory/userFactory';
import initUserModel, { User } from 'model/sequelize/model/user/user';
import { UserRequired, UserRole } from 'model/sequelize/model/user/user.types';
import { Sequelize } from 'sequelize';
import { DEFAULT_DB_DIALECT } from 'src/defaults';
import { Context } from '../../../context/context.types';
import { UserBody } from './updateUser.types';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { AppRequest } from 'web/serverModules/types';
import { RequestImplicits } from '../../../paramHandlers/paramHandlers.types';
import { expect as expectChai } from 'chai';
import { InvalidInput, NotAuthorized } from 'common/httpErrors';
import sanitizeModel from 'model/sequelize/sanitizeModel/sanitizeModel';

type AppReq = AppRequest<User, RequestImplicits, unknown, UserBody>;

const USER_REQUIRED: UserRequired = {
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe.doe@company.com'
};

const ADMIN_REQUIRED: UserRequired = {
  firstName: 'Admin',
  lastName: 'Adminovic',
  email: 'admin.adminovic@company.com',
  role: UserRole.Admin
};

const buildUser = (items: UserRequired) => userFactory(items)
  .lift(userReq => User.build(userReq))
  .caseOf({ right: (user) => user });

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Portal', () => {
      describe('controller', () => {
        describe('user controller', () => {
          describe('update user by id', () => {
            let sequelize: Sequelize;
            let user: User;
            let currentUser: User;
            let context: Context;
            let req: AppReq;
            let body: UserBody;

            let result: Either<AppError, User>;

            beforeAll(() => {
              appLogger.error = (_) => appLogger; // disable logger
              sequelize = new Sequelize(null, null, null, { dialect: DEFAULT_DB_DIALECT });
              initUserModel(sequelize);
              user = buildUser(USER_REQUIRED);
            });

            describe(`Happy path`, () => {
              beforeAll(async () => {
                currentUser = buildUser(ADMIN_REQUIRED);
                body = {
                  firstName: 'Jon',
                  lastName: 'Black',
                  active: false
                };

                User.update = jest.fn().mockResolvedValue([1]);
                User.findAndCountAll = jest.fn().mockResolvedValue({ rows: [user], count: 1 });
                req = { implicits: { user }, currentUser, body } as AppReq;
                context = { implicits: req.implicits, loggedInUser: req.currentUser };

                result = await updateUserUnbound
                  .apply(null, [bodyValidator, authorizationValidator, sanitizeModel])
                  .apply(null, [userService()])
                  .apply(null, [context, req, null]);
              });

              it(`Should resolve with exact Either right side`, () => {
                result.do({
                  right: (user: User) =>
                    expectChai(user)
                      .to.be.an({}.constructor.name)
                      .which.is.deep.equal({ ...user, ...body }),
                  left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
                });
              });
            });

            describe(`Body validator`, () => {
              beforeAll(async () => {
                currentUser = buildUser(ADMIN_REQUIRED);
                body = {
                  firstName: 'Jon',
                  lastName: 'Black',
                  role: 'role' as UserRole
                };

                req = { implicits: { user }, currentUser, body } as AppReq;
                context = { implicits: req.implicits, loggedInUser: req.currentUser };

                result = await updateUserUnbound
                  .apply(null, [bodyValidator, authorizationValidator, sanitizeModel])
                  .apply(null, [userService()])
                  .apply(null, [context, req, null]);
              });

              it(`Should resolve with Either with exact error in left side`, () => {
                const ERROR_MESSAGE: string = 'Validation failed: ["Invalid user role"]';
                result.do({
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

            describe(`Authorization validator`, () => {
              beforeAll(async () => {
                currentUser = user;
                body = {
                  firstName: 'Jon',
                  lastName: 'Black',
                  role: UserRole.Admin
                };

                req = { implicits: { user }, currentUser, body } as AppReq;
                context = { implicits: req.implicits, loggedInUser: req.currentUser };

                result = await updateUserUnbound
                  .apply(null, [bodyValidator, authorizationValidator, sanitizeModel])
                  .apply(null, [userService()])
                  .apply(null, [context, req, null]);
              });

              it(`Should resolve with exact Either right side`, () => {
                const ERROR_MESSAGE: string = 'Validation failed: ["User cannot change his role"]';
                result.do({
                  right: (): void => fail(`Right side has not been expected`),
                  left: (error: AppError) => {
                    expect(error)
                      .toBeInstanceOf(NotAuthorized);
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
