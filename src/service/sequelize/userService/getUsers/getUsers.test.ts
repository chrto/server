import getUsersUnbound from './getUsers.unbound';
import { AppError } from 'common/error';
import initUserModel, { User } from 'model/sequelize/model/user/user';
import { UserRole } from 'model/sequelize/model/user/user.types';
import { FindOptions, Options, Sequelize, WhereOptions } from 'sequelize';
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
const WHERE: WhereOptions = { firstName: 'Joe' };

describe('Service', () => {
  describe('Sequelize', () => {
    describe('User Service', () => {
      describe(`Get users`, () => {
        let findAll: jest.Mock<Promise<Either<AppError, User[]>>, [FindOptions]>;
        let users: User[];
        let result: Either<AppError, User[]>;

        beforeAll(async () => {
          initUserModel(new Sequelize(SEQUELIZE_CONFIG));
          users = [User.build(ITEMS)];
        });

        describe('Happy path', () => {
          beforeAll(async () => {
            findAll = jest.fn().mockResolvedValue(Either.right<AppError, User[]>(users));
            result = await getUsersUnbound
              .apply(null, [{ findAll }])
              .apply(null, [INCLUDES])
              .apply(null, [])
              .apply(null, [WHERE]);
          });

          it(`Should find users in storage and return Either with exact User array in right side`, () => {
            result.do({
              right: (users: User[]): void => {
                expect(users).toBeArray;
                expect(users[0]).toBeInstanceOf(User);
                expect(users[0].get()).toStrictEqual(ITEMS);
              },
              left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
            });
          });
        });

        describe('Error path', () => {
          const appError: NotFound = new NotFound('not exists');
          beforeAll(async () => {
            findAll = jest.fn().mockResolvedValue(Either.left<AppError, User>(appError));
            result = await getUsersUnbound
              .apply(null, [{ findAll }])
              .apply(null, [INCLUDES])
              .apply(null, [])
              .apply(null, [WHERE]);
          });

          it(`Should not find users in storage and return Either with exact error in left side`, () => {
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
