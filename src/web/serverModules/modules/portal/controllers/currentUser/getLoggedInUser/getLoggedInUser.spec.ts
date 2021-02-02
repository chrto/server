import getLoggedInUserUnbound from './getLoggedInUser.unbound';
import userFactory from 'model/sequelize/user/factory/userFactory';
import initUserModel, { User } from 'model/sequelize/user/user';
import { UserRequired } from 'model/sequelize/user/user.types';
import { Model, Sequelize } from 'sequelize';
import { DEFAULT_DB_DIALECT } from 'src/defaults';
import { Context } from '../../../context/context.types';

const USER_REQUIRED: UserRequired = {
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe.doe@company.com'
};

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Portal', () => {
      describe('controller', () => {
        describe('current user controller', () => {
          describe('get logged in user', () => {
            let sequelize: Sequelize;
            let sanitizeEntity: jest.Mock<any, [Model<User>]>;
            let user: User;
            let context: Context;

            beforeAll(async () => {
              sequelize = new Sequelize(null, null, null, { dialect: DEFAULT_DB_DIALECT });
              initUserModel(sequelize);
              user = userFactory(USER_REQUIRED)
                .lift(userReq => User.build(userReq))
                .caseOf({ right: (user) => user });

              context = { loggedInUser: user };
              sanitizeEntity = jest.fn().mockImplementation((user: User) => user.get({ plain: true }));
              await getLoggedInUserUnbound
                .apply(null, [sanitizeEntity])
                .apply(null, [context, null, null]);
            });

            it('Should sanitize current user model from context', () => {
              expect(sanitizeEntity)
                .toHaveBeenCalledTimes(1);
              expect(sanitizeEntity)
                .toHaveBeenCalledWith(context.loggedInUser);
            });
          });
        });
      });
    });
  });
});
