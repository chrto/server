import createUserUnbound from './createUser.unbound';
import { expect as expectChai } from 'chai';
import { AppError } from 'common/error';
import initUserModel, { User } from 'model/sequelize/user/user';
import { UserRole } from 'model/sequelize/user/user.types';
import { Options, Sequelize } from 'sequelize';
import { Either } from 'tsmonad';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';
import { Conflict } from 'common/httpErrors';

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

describe('Service', () => {
  describe('Sequelize', () => {
    describe('User Service', () => {
      describe(`Create new user`, () => {
        let createUserModel;
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
              .apply(null, [])
              .apply(null, [ITEMS]);
          });

          it(`Should create new user in storage and return Either with User model in right side`, () => {
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
          const appError: Conflict = new Conflict('user exists');
          beforeAll(async () => {
            createUserModel = jest.fn().mockResolvedValue(Either.left<AppError, User>(appError));
            result = await createUserUnbound
              .apply(null, [{ create: createUserModel }])
              .apply(null, [])
              .apply(null, [])
              .apply(null, [ITEMS]);
          });

          it(`Should not create new user in storage and return Either with exact error in left side`, () => {
            result.do({
              right: (): void => fail(`Right side has not been expected`),
              left: (error: AppError) => {
                expect(error)
                  .toBeInstanceOf(Conflict);
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
