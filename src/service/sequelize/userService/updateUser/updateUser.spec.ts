import updateUserUnbound from './updateUser.unbound';
import { AppError } from 'common/error';
import initUserModel, { User } from 'model/sequelize/model/user/user';
import { UserRole } from 'model/sequelize/model/user/user.types';
import { Options, Sequelize } from 'sequelize';
import { Either } from 'tsmonad';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';
import { SequelizeIncludes } from 'service/sequelize/types';
import { NotFound } from 'common/httpErrors';

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
      describe(`Update user`, () => {
        let update;
        let user: User;
        beforeAll(async () => {
          initUserModel(new Sequelize(SEQUELIZE_CONFIG));
          user = User.build(ITEMS);
          update = jest.fn().mockResolvedValue(Either.right<AppError, User>(user));
          await updateUserUnbound
            .apply(null, [{ update }])
            .apply(null, [INCLUDES])
            .apply(null, [])
            .apply(null, [user.get()]);
        });

        it(`Should call update storage with exact parameters`, () => {
          expect(update)
            .toHaveBeenCalledTimes(1);
          expect(update)
            .toHaveBeenCalledWith(
              User,
              user.get(),
              { where: { id: ITEMS.id }, ...INCLUDES },
              new NotFound(`Cannot find user identified by id = '${user.id}'`)
            );
        });
      });
    });
  });
});
