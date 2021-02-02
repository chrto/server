import getUserByIdUnbound from './getUserById.unbound';
import { sanitizeEntity } from 'service/sequelize/common/modelHelper';
import { expect as expectChai } from 'chai';
import { AppError } from 'common/error';
import userFactory from 'model/sequelize/user/factory/userFactory';
import initUserModel, { User } from 'model/sequelize/user/user';
import { UserRequired } from 'model/sequelize/user/user.types';
import { Sequelize } from 'sequelize';
import { DEFAULT_DB_DIALECT } from 'src/defaults';
import { Either } from 'tsmonad';
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
                .apply(null, [sanitizeEntity])
                .apply(null, [context, null, null]);
            });

            it('Should return Either with user object in right side', () => {
              result.do({
                right: (currentUser) => {
                  expectChai(currentUser)
                    .to.be.deep.equal(context.implicits.user.get({ plain: true }));
                }
              });
            });
          });
        });
      });
    });
  });
});
