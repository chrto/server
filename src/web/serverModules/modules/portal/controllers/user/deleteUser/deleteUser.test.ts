import deleteUserUnbound from './deleteUser.unbound';
import initUserModel, { User } from 'model/sequelize/model/user/user';
import { UserItems, UserRole } from 'model/sequelize/model/user/user.types';
import { Sequelize } from 'sequelize';
import { DEFAULT_DB_DIALECT } from 'src/defaults';
import { Context } from '../../../context/context.types';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { DeletedUser } from './deleteUser.types';
import differentEntity from 'web/serverModules/common/authorization/validators/differentEntity/differentEntity';
import userService from 'service/sequelize/userService/userService';
import { NotAuthorized } from 'common/httpErrors';

import logger from 'utils/logger';

const USER_REQUIRED: UserItems = {
  id: '3a2cffc9-1fc5-4a05-87d8-8411cd4f920c',
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe.doe@company.com',
  role: UserRole.User,
  active: true
};

const CURRENT_USER_REQUIRED: UserItems = {
  id: 'f72fa53a-411c-44ed-a1b2-7d82845cc955',
  firstName: 'Admin',
  lastName: 'Adminovic',
  email: 'admin.adminovic@company.com',
  role: UserRole.Admin,
  active: true
};

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Portal', () => {
      describe('controller', () => {
        describe('user controller', () => {
          describe('delete user by id', () => {
            let sequelize: Sequelize;
            let user: User;
            let currentUser: User;
            let context: Context;
            let result: Either<AppError, DeletedUser>;

            beforeAll(async () => {
              logger.error = (_) => logger; // disable logger

              sequelize = new Sequelize(null, null, null, { dialect: DEFAULT_DB_DIALECT });
              initUserModel(sequelize);
              user = User.build(USER_REQUIRED);
              currentUser = User.build(CURRENT_USER_REQUIRED);
            });

            describe('Happy path', () => {
              beforeAll(async () => {
                jest.clearAllMocks();
                User.destroy = jest.fn().mockResolvedValue(1);
                context = { implicits: { user }, loggedInUser: currentUser };

                result = await deleteUserUnbound
                  .apply(null, [differentEntity])
                  .apply(null, [userService()])
                  .apply(null, [context, null, null]);
              });

              it('', () => {
                expect(User.destroy)
                  .toHaveBeenCalledTimes(1);
                expect(User.destroy)
                  .toHaveBeenCalledWith({ where: { id: user.id }, ...{} });
              });

              it(`Should return Either with exact object in right side`, () => {
                result.do({
                  right: (value: DeletedUser): void => {
                    expect(value)
                      .toEqual({ removedUserId: USER_REQUIRED.id });
                  },
                  left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
                });
              });
            });

            describe('Errort path', () => {
              describe('Authorization', () => {
                beforeAll(async () => {
                  jest.clearAllMocks();
                  User.destroy = jest.fn().mockResolvedValue(1);
                  context = { implicits: { user }, loggedInUser: user };

                  result = await deleteUserUnbound
                    .apply(null, [differentEntity])
                    .apply(null, [userService()])
                    .apply(null, [context, null, null]);
                });

                it(`Should return Either with exact error in left side`, () => {
                  result.do({
                    right: (_value: DeletedUser): void => fail(`Right side has not been expected`),
                    left: (error: AppError) => {
                      expect(error)
                        .toBeInstanceOf(NotAuthorized);
                      expect(error.message)
                        .toEqual('User cannot delete himself');
                    }
                  });
                });
              });

              describe('Service', () => {
                const serviceError: AppError = new AppError('service.error', 'Internal server error');

                beforeAll(async () => {
                  jest.clearAllMocks();
                  User.destroy = jest.fn().mockRejectedValue(serviceError);
                  context = { implicits: { user }, loggedInUser: currentUser };

                  result = await deleteUserUnbound
                    .apply(null, [differentEntity])
                    .apply(null, [userService()])
                    .apply(null, [context, null, null]);
                });

                it(`Should return Either with exact error in left side`, () => {
                  result.do({
                    right: (_value: DeletedUser): void => fail(`Right side has not been expected`),
                    left: (error: AppError) => {
                      expect(error)
                        .toBeInstanceOf(AppError);
                      expect(error.message)
                        .toEqual('Internal Server Error');
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
});
