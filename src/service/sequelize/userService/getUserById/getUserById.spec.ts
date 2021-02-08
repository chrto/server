import getUserByIdUnbound from './getUserById.unbound';
import { AppError } from 'common/error';
import initUserModel, { User } from 'model/sequelize/model/user/user';
import { UserRole } from 'model/sequelize/model/user/user.types';
import { FindOptions, Options, Sequelize } from 'sequelize';
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
      describe(`Get user by id`, () => {
        let findByPk: jest.Mock<Promise<Either<AppError, User>>, [string, FindOptions, AppError]>;
        beforeAll(async () => {
          initUserModel(new Sequelize(SEQUELIZE_CONFIG));
          findByPk = jest.fn().mockResolvedValue(Either.right<AppError, User>(User.build(ITEMS)));
          await getUserByIdUnbound
            .apply(null, [{ findByPk }])
            .apply(null, [INCLUDES])
            .apply(null, [])
            .apply(null, [ITEMS.id]);
        });

        it(`Should call findByPk storage with exact parameters`, () => {
          expect(findByPk)
            .toHaveBeenCalledTimes(1);
          expect(findByPk)
            .toHaveBeenCalledWith(
              ITEMS.id,
              { ...INCLUDES },
              new NotFound(`Cannot find user identified by id = '${ITEMS.id}'`)
            );
        });
      });
    });
  });
});
