import createUserUnbound from './createUser.unbound';
import { AppError } from 'common/error';
import initUserModel, { User } from 'model/sequelize/user/user';
import { UserRole } from 'model/sequelize/user/user.types';
import { Options, Sequelize } from 'sequelize';
import { Either } from 'tsmonad';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';

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
        let user: User;
        beforeAll(async () => {
          initUserModel(new Sequelize(SEQUELIZE_CONFIG));
          user = User.build(ITEMS);
          createUserModel = jest.fn().mockResolvedValue(Either.right<AppError, User>(user));
          await createUserUnbound
            .apply(null, [{ create: createUserModel }])
            .apply(null, [])
            .apply(null, [])
            .apply(null, [ITEMS]);
        });

        it(`Should call create storage with exact parameters`, () => {
          expect(createUserModel)
            .toHaveBeenCalledTimes(1);
          expect(createUserModel)
            .toHaveBeenCalledWith(User, ITEMS, undefined);
        });
      });
    });
  });
});
