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
      expect(user).toHaveProperty('id');
      expect(user.id).toBe(items.id);

      expect(user).toHaveProperty('firstName');
      expect(user.firstName).toBe(items.firstName);

      expect(user).toHaveProperty('lastName');
      expect(user.lastName).toBe(items.lastName);

      expect(user).toHaveProperty('email');
      expect(user.email).toBe(items.email);

      expect(user).toHaveProperty('active');
      expect(user.active).toBe(items.active);

      expect(user).toHaveProperty('role');
      expect(user.role).toBe(items.role);

      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
      expect(user).toHaveProperty('fullName');
      expect(user).toHaveProperty('isAdmin');
    });

    it('after build it should have helpers', () => {
      expect(user.fullName).toBe(`${items.firstName} ${items.lastName}`);
      expect(user.isAdmin).toBeTrue;
    });

    it('Should update user items', () => {
      user.setAttributes({
        firstName: 'Jack',
        lastName: 'Black',
        active: false,
        role: UserRole.User
      });

      expect(user.fullName).toBe('Jack Black');
      expect(user.active).toBe(false);
      expect(user.role).toBe(UserRole.User);
    });

    it('should have exact table name', () => {
      expect(User.getTableName()).toBe('users');
    });
  });
});
