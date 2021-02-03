import getUsersUnbound from './getUsers.unbound';
import { AppError } from 'common/error';
import initUserModel, { User } from 'model/sequelize/user/user';
import { UserRole } from 'model/sequelize/user/user.types';
import { Options, Sequelize, WhereOptions } from 'sequelize';
import { Either } from 'tsmonad';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';
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

const WHERE: WhereOptions = { firstName: 'Joe' };

describe('Service', () => {
  describe('Sequelize', () => {
    describe('User Service', () => {
      describe(`Get users`, () => {
        let findAll;
        beforeAll(async () => {
          initUserModel(new Sequelize(SEQUELIZE_CONFIG));
          findAll = jest.fn().mockResolvedValue(Either.right<AppError, User[]>([User.build(ITEMS)]));
          await getUsersUnbound
            .apply(null, [{ findAll }])
            .apply(null, [INCLUDES])
            .apply(null, [])
            .apply(null, [WHERE]);
        });

        it(`Should call findAll storage with exact parameters`, () => {
          expect(findAll)
            .toHaveBeenCalledTimes(1);
          expect(findAll)
            .toHaveBeenCalledWith(
              User,
              { where: WHERE, order: undefined, ...INCLUDES }
            );
        });
      });
    });
  });
});
