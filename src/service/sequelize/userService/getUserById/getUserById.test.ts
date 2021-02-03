import getUserByIdUnbound from './getUserById.unbound';
import { expect as expectChai } from 'chai';
import { AppError } from 'common/error';
import initUserModel, { User } from 'model/sequelize/user/user';
import { UserRole } from 'model/sequelize/user/user.types';
import { Options, Sequelize } from 'sequelize';
import { Either } from 'tsmonad';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';
import { NotFound } from 'common/httpErrors';
import { SequelizeIncludes } from 'service/sequelize/types';

const SEQUELIZE_CONFIG: Options = {
  dialect: EDatabaseDialect.sqlite,
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
      describe(`Get user by id`, () => {
        let findByPk;
        let user: User;
        let result: Either<AppError, User>;

        beforeAll(async () => {
          initUserModel(new Sequelize(SEQUELIZE_CONFIG));
          user = User.build(ITEMS);
        });

        describe('Happy path', () => {
          beforeAll(async () => {
            findByPk = jest.fn().mockResolvedValue(Either.right<AppError, User>(user));
            result = await getUserByIdUnbound
              .apply(null, [{ findByPk }])
              .apply(null, [INCLUDES])
              .apply(null, [])
              .apply(null, [ITEMS.id]);
          });

          it(`Should find user in storage and return Either with exact User in right side`, () => {
            result.do({
              right: (user: User): void => {
                expectChai(user)
                  .to.be.instanceOf(User);
                expectChai(user.get())
                  .to.be.deep.equal(ITEMS);
              },
              left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
            });
          });
        });

        describe('Error path', () => {
          const appError: NotFound = new NotFound('user not exists');
          beforeAll(async () => {
            findByPk = jest.fn().mockResolvedValue(Either.left<AppError, User>(appError));
            result = await getUserByIdUnbound
              .apply(null, [{ findByPk }])
              .apply(null, [INCLUDES])
              .apply(null, [])
              .apply(null, [ITEMS.id]);
          });

          it(`Should not find user in storage and return Either with exact error in left side`, () => {
            result.do({
              right: (): void => fail(`Right side has not been expected`),
              left: (error: AppError) => {
                expect(error)
                  .toBeInstanceOf(NotFound);
                expect(error.message)
                  .toEqual(appError.message);
              }
            });
          });
        });
      });
    });
  });
});
