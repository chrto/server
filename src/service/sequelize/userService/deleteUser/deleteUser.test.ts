import deleteUserUnbound from './deleteUser.unbound';
import { AppError } from 'common/error';
import initUserModel, { User } from 'model/sequelize/model/user/user';
import { UserRole } from 'model/sequelize/model/user/user.types';
import { DestroyOptions, Options, Sequelize } from 'sequelize';
import { Either } from 'tsmonad';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';
import { NotFound } from 'common/httpErrors';

const SEQUELIZE_CONFIG: Options = {
  dialect: EDatabaseDialect.sqlite
};

const ITEMS = {
  id: 'f923b2c9-ffcf-4a0a-bdc9-a4a4ae2a687e',
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe.doe@company.com',
  active: true,
  role: UserRole.Admin
};

describe('Service', () => {
  describe('Sequelize', () => {
    describe('User Service', () => {
      describe(`Delete user`, () => {
        let createUserModel: jest.Mock<Promise<Either<AppError, number>>, [DestroyOptions]>;
        let user: User;
        let result: Either<AppError, number>;

        beforeAll(async () => {
          initUserModel(new Sequelize(SEQUELIZE_CONFIG));
          user = User.build(ITEMS);
        });

        describe('Happy path', () => {
          beforeAll(async () => {
            createUserModel = jest.fn().mockResolvedValue(Either.right<AppError, number>(1));
            result = await deleteUserUnbound
              .apply(null, [{ destroy: createUserModel }])
              .apply(null, [])
              .apply(null, [user]);
          });

          it(`Should delete user from storage and return Either with count in right side`, () => {
            result.do({
              right: (count: number): void => {
                expect(count).toBe(1);
              },
              left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
            });
          });
        });

        describe('Error path', () => {
          const appError: NotFound = new NotFound('user not exists');
          beforeAll(async () => {
            createUserModel = jest.fn().mockResolvedValue(Either.left<AppError, User>(appError));
            result = await deleteUserUnbound
              .apply(null, [{ destroy: createUserModel }])
              .apply(null, [])
              .apply(null, [user]);
          });

          it(`Should not delete user from storage and return Either with exact error in left side`, () => {
            result.do({
              right: (): void => fail(`Right side has not been expected`),
              left: (error: AppError) => {
                expect(error).toBeInstanceOf(NotFound);
                expect(error.message).toEqual(appError.message);
              }
            });
          });
        });
      });
    });
  });
});
