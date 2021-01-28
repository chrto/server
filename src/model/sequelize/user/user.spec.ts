import { expect as expectChai } from 'chai';
import { Options, Sequelize } from 'sequelize';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';
import initUserModel, { User } from './user';
import { UserItems, UserRole } from './user.types';

describe('sequelize model', () => {
  const spiedUserInit = jest.spyOn(User, 'init');
  let items: UserItems;
  let user: User;
  beforeAll(() => {
    const SEQUELIZE_CONFIG: Options = {
      dialect: EDatabaseDialect.sqlite,
      storage: null,
      logging: false,
      define: {
        timestamps: true
      }
    };
    initUserModel(new Sequelize(SEQUELIZE_CONFIG));

    items = {
      id: 'f923b2c9-ffcf-4a0a-bdc9-a4a4ae2a687e',
      firstName: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@company.com',
      active: true,
      role: UserRole.Admin
    };
    user = User.build(items);
  });

  describe('user', () => {
    it('Should init User model', () => {
      expect(spiedUserInit).toHaveBeenCalled();
    });

    it('after build it should have exact data', () => {
      expectChai(user)
        .to.have.property('id')
        .which.is.equal(items.id);
      expectChai(user)
        .to.have.property('firstName')
        .which.is.equal(items.firstName);
      expectChai(user)
        .to.have.property('lastName')
        .which.is.equal(items.lastName);
      expectChai(user)
        .to.have.property('email')
        .which.is.equal(items.email);
      expectChai(user)
        .to.have.property('active')
        .which.is.equal(items.active);
      expectChai(user)
        .to.have.property('role')
        .which.is.equal(items.role);
      expectChai(user)
        .to.have.property('createdAt');
      expectChai(user)
        .to.have.property('updatedAt');
      expectChai(user)
        .to.have.property('fullName');
      expectChai(user)
        .to.have.property('isAdmin');
    });

    it('after build it should have helpers', () => {
      expectChai(user.fullName)
        .to.be.equal(`${items.firstName} ${items.lastName}`);
      expectChai(user.isAdmin)
        .to.be.equal(true);
    });

    it('Should update user items', () => {
      user.setAttributes({
        firstName: 'Jack',
        lastName: 'Black',
        active: false,
        role: UserRole.User
      });

      expectChai(user.fullName)
        .to.be.equal('Jack Black');
      expectChai(user.active)
        .to.be.equal(false);
      expectChai(user.role)
        .to.be.equal(UserRole.User);
    });

    it('should have exact table name', () => {
      expectChai(User.getTableName()).to.be.equal('users');
    });
  });
});
