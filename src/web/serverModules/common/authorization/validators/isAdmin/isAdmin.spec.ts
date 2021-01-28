import isAdmin from './isAdmin';
import { expect as expectChai } from 'chai';
import initUserModel, { User } from 'model/sequelize/user/user';
import { UserItems, UserRole } from 'model/sequelize/user/user.types';
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
          expectChai(isAdmin(admin))
            .to.be.an('boolean')
            .which.is.equal(true);
        });

        it(`Should return 'false', if user is not admin`, () => {
          expectChai(isAdmin(user))
            .to.be.an('boolean')
            .which.is.equal(false);
        });

        it(`Should return 'false', if user is null`, () => {
          expectChai(isAdmin(null))
            .to.be.an('boolean')
            .which.is.equal(false);
        });

        it(`Should return 'false', if user is unknown object`, () => {
          expectChai(isAdmin({} as User))
            .to.be.an('boolean')
            .which.is.equal(false);
        });
      });
    });
  });
});
