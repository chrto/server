import getUsersUnbound from './getUsers.unbound';
import { AppError } from 'common/error';
import userFactory from 'model/sequelize/user/factory/userFactory';
import initUserModel, { User } from 'model/sequelize/user/user';
import { UserRequired } from 'model/sequelize/user/user.types';
import { Sequelize } from 'sequelize';
import { sanitizeEntity } from 'service/sequelize/common/modelHelper';
import { DEFAULT_DB_DIALECT } from 'src/defaults';
import { Either } from 'tsmonad';

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
          describe('get users', () => {
            let sequelize: Sequelize;
            let users: User[];
            let sanitizeEntities: jest.Mock<any[], [User[]]>;
            let getUsersExecutor: jest.Mock<Promise<Either<AppError, User[]>>, [any, any, any]>;
            let userService;

            beforeAll(async () => {
              sequelize = new Sequelize(null, null, null, { dialect: DEFAULT_DB_DIALECT });
              initUserModel(sequelize);
              users = [userFactory(USER_REQUIRED).lift(userReq => User.build(userReq)).caseOf({ right: (user) => user })];
              sanitizeEntities = jest.fn().mockImplementation((users: User[]) => users.map(sanitizeEntity));

              getUsersExecutor = jest.fn().mockResolvedValue(Either.right(users));
              userService = {
                getUsers: jest.fn().mockImplementation(() => getUsersExecutor)
              };

              await getUsersUnbound
                .apply(null, [sanitizeEntities])
                .apply(null, [userService])
                .apply(null, [null, null, null]);
            });

            it(`Should call exact service`, () => {
              expect(userService.getUsers)
                .toHaveBeenCalledTimes(1);
              expect(userService.getUsers)
                .toHaveBeenCalledWith();

              expect(getUsersExecutor)
                .toHaveBeenCalledTimes(1);
              expect(getUsersExecutor)
                .toHaveBeenCalledWith();
            });

            it(`Should sanitize service result`, () => {
              expect(sanitizeEntities)
                .toHaveBeenCalledTimes(1);
              expect(sanitizeEntities)
                .toHaveBeenCalledWith(users);

              expect(sanitizeEntities)
                .toHaveBeenCalledAfter(getUsersExecutor);
            });
          });
        });
      });
    });
  });
});
