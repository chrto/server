import isAdmin from './isAdmin';
import initUserModel, { User } from 'model/sequelize/model/user/user';
import { UserItems, UserRole } from 'model/sequelize/model/user/user.types';
import { Options, Sequelize } from 'sequelize';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';

const SEQUELIZE_CONFIG: Options = {
  dialect: EDatabaseDialect.sqlite,
  storage: null,
  logging: false,
  define: {
    timestamps: true
  }
};

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`authorization`, () => {
      describe(`isAdmin`, () => {
        let items: UserItems;
        let admin: User;
        let user: User;
        beforeAll(() => {
          initUserModel(new Sequelize(SEQUELIZE_CONFIG));
          items = {
            id: 'f923b2c9-ffcf-4a0a-bdc9-a4a4ae2a687e',
            firstName: 'Joe',
            lastName: 'Doe',
            email: 'joe.doe@company.com',
            active: true,
            role: UserRole.Admin
          };
          admin = User.build({ items, role: UserRole.Admin });
          user = User.build({ items, role: UserRole.User });
        });

        it(`Should return 'true', if user is admin`, () => {
          const result = isAdmin(admin);

          expect(result).toBeBoolean;
          expect(result).toBeTrue;
        });

        it(`Should return 'false', if user is not admin`, () => {
          const result = isAdmin(user);

          expect(result).toBeBoolean;
          expect(result).toBeFalse;
        });

        it(`Should return 'false', if user is null`, () => {
          const result = isAdmin(null);

          expect(result).toBeBoolean;
          expect(result).toBeFalse;
        });

        it(`Should return 'false', if user is unknown object`, () => {
          const result = isAdmin({} as User);

          expect(result).toBeBoolean;
          expect(result).toBeFalse;
        });
      });
    });
  });
});
