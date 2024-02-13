import getUserByEmailUnbound from './getUserByEmail.unbound';
import { AppError } from 'common/error';
import initUserModel, { User } from 'model/sequelize/model/user/user';
import { UserRole } from 'model/sequelize/model/user/user.types';
import { FindOptions, Options, Sequelize } from 'sequelize';
import { Either } from 'tsmonad';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';
import { NotFound } from 'common/httpErrors';
import { SequelizeIncludes } from 'service/sequelize/types';

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

const INCLUDES: SequelizeIncludes = { include: [] };

describe('Service', () => {
  describe('Sequelize', () => {
    describe('User Service', () => {
      describe(`Get user by email`, () => {
        let findOne: jest.Mock<Promise<Either<AppError, User>>, [FindOptions, AppError]>;
        let user: User;
        let result: Either<AppError, User>;

        beforeAll(async () => {
          initUserModel(new Sequelize(SEQUELIZE_CONFIG));
          user = User.build(ITEMS);
        });

        describe('Happy path', () => {
          beforeAll(async () => {
            findOne = jest.fn().mockResolvedValue(Either.right<AppError, User>(user));
            result = await getUserByEmailUnbound
              .apply(null, [{ findOne }])
              .apply(null, [INCLUDES])
              .apply(null, [])
              .apply(null, [ITEMS.email]);
          });

          it(`Should find user in storage and return Either with exact User in right side`, () => {
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
          const appError: NotFound = new NotFound('user not exists');
          beforeAll(async () => {
            findOne = jest.fn().mockResolvedValue(Either.left<AppError, User>(appError));
            result = await getUserByEmailUnbound
              .apply(null, [{ findOne }])
              .apply(null, [INCLUDES])
              .apply(null, [])
              .apply(null, [ITEMS.email]);
          });

          it(`Should not find user in storage and return Either with exact error in left side`, () => {
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
