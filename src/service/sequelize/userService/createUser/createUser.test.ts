import createUserUnbound from './createUser.unbound';
import { AppError } from 'common/error';
import initUserModel, { User } from 'model/sequelize/model/user/user';
import { UserRole } from 'model/sequelize/model/user/user.types';
import { CreateOptions, Options, Sequelize } from 'sequelize';
import { Either } from 'tsmonad';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';
import { Conflict } from 'common/httpErrors';

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
      describe(`Create new user`, () => {
        let createUserModel: jest.Mock<Promise<Either<AppError, User>>, [object, CreateOptions]>;
        let result: Either<AppError, User>;

        beforeAll(async () => {
          initUserModel(new Sequelize(SEQUELIZE_CONFIG));
        });

        describe('Happy path', () => {
          beforeAll(async () => {
            createUserModel = jest.fn().mockResolvedValue(Either.right<AppError, User>(User.build(ITEMS)));
            result = await createUserUnbound
              .apply(null, [{ create: createUserModel }])
              .apply(null, [])
              .apply(null, [ITEMS]);
          });

          it(`Should create new user in storage and return Either with User model in right side`, () => {
            result.do({
              right: (user: User): void => {
                expect(user).toBeInstanceOf(User);
                expect(user.get()).toStrictEqual(ITEMS);
              },
              left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
            });
          });
        });

        describe('Error path', () => {
          const appError: Conflict = new Conflict('user exists');
          beforeAll(async () => {
            createUserModel = jest.fn().mockResolvedValue(Either.left<AppError, User>(appError));
            result = await createUserUnbound
              .apply(null, [{ create: createUserModel }])
              .apply(null, [])
              .apply(null, [ITEMS]);
          });

          it(`Should not create new user in storage and return Either with exact error in left side`, () => {
            result.do({
              right: (): void => fail(`Right side has not been expected`),
              left: (error: AppError) => {
                expect(error).toBeInstanceOf(Conflict);
                expect(error.message).toEqual(appError.message);
              }
            });
          });
        });
      });
    });
  });
});
