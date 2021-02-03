import deleteUserUnbound from './deleteUser.unbound';
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
      describe(`Delete user`, () => {
        let deleteUserModel;
        beforeAll(async () => {
          initUserModel(new Sequelize(SEQUELIZE_CONFIG));
          deleteUserModel = jest.fn().mockResolvedValue(Either.right<AppError, number>(1));
          await deleteUserUnbound
            .apply(null, [{ destroy: deleteUserModel }])
            .apply(null, [])
            .apply(null, [])
            .apply(null, [User.build(ITEMS)]);
        });

        it(`Should call destroy storage with exact parameters`, () => {
          expect(deleteUserModel)
            .toHaveBeenCalledTimes(1);
          expect(deleteUserModel)
            .toHaveBeenCalledWith(User, { where: { id: ITEMS.id } });
        });
      });
    });
  });
});
