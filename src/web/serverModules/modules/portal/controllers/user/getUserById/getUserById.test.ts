import getUserByIdUnbound from './getUserById.unbound';
import { AppError } from 'common/error';
import userFactory from 'model/sequelize/model/user/factory/userFactory';
import initUserModel, { User } from 'model/sequelize/model/user/user';
import { UserRequired } from 'model/sequelize/model/user/user.types';
import { Sequelize } from 'sequelize';
import { DEFAULT_DB_DIALECT } from 'src/defaults';
import { Either } from 'tsmonad';
import { Context } from '../../../context/context.types';
import sanitizeModel from 'model/sequelize/sanitizeModel/sanitizeModel';

const USER_REQUIRED: UserRequired = {
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe.doe@company.com'
};

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Portal', () => {
      describe('controller', () => {
        describe('user controller', () => {
          describe('get user by id', () => {
            let sequelize: Sequelize;
            let user: User;
            let context: Context;
            let result: Either<AppError, User>;

            beforeAll(async () => {
              sequelize = new Sequelize(null, null, null, { dialect: DEFAULT_DB_DIALECT });
              initUserModel(sequelize);
              user = userFactory(USER_REQUIRED)
                .lift(userReq => User.build(userReq))
                .caseOf({ right: (user) => user });

              context = { implicits: { user }, loggedInUser: null };
              result = await getUserByIdUnbound
                .apply(null, [sanitizeModel])
                .apply(null, [context, null, null]);
            });

            it('Should return Either with user object in right side', () => {
              result.do({
                right: (currentUser) => {
                  expect(currentUser).toStrictEqual(context.implicits.user.get({ plain: true }));
                }
              });
            });
          });
        });
      });
    });
  });
});
