import updateUserUnbound from './updateUser.unbound';
import userFactory from 'model/sequelize/model/user/factory/userFactory';
import initUserModel, { User } from 'model/sequelize/model/user/user';
import { UserRequired } from 'model/sequelize/model/user/user.types';
import { Sequelize } from 'sequelize';
import { DEFAULT_DB_DIALECT } from 'src/defaults';
import { Context } from '../../../context/context.types';
import { UserBody } from './updateUser.types';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { AppRequest } from 'web/serverModules/types';
import { RequestImplicits } from '../../../paramHandlers/paramHandlers.types';

type BodyValidator = jest.Mock<Either<AppError, UserBody>, [UserBody]>;
type AppReq = AppRequest<User, RequestImplicits, unknown, UserBody>;

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
          describe('update user by id', () => {
            let sequelize: Sequelize;
            let user: User;
            let context: Context;
            let req: AppReq;

            let bodyValidator: BodyValidator;
            let validator: BodyValidator;
            let authorizationValidator: jest.Mock<BodyValidator, [User, User]>;
            let sanitizeEntity: jest.Mock<any, [User]>;
            let spyOnUserSet: jest.SpyInstance<User>;
            let userService;
            let updateUserExecutor: jest.Mock<Promise<Either<AppError, User>>, [User]>;

            beforeAll(async () => {
              sequelize = new Sequelize(null, null, null, { dialect: DEFAULT_DB_DIALECT });
              initUserModel(sequelize);
              user = userFactory(USER_REQUIRED)
                .lift(userReq => User.build(userReq))
                .caseOf({ right: (user) => user });
              spyOnUserSet = jest.spyOn(user, 'set');

              req = {
                implicits: { user },
                currentUser: user,
                body: {}
              } as AppReq;

              context = { implicits: req.implicits, loggedInUser: req.currentUser };

              bodyValidator = jest.fn().mockImplementation((body: UserBody) => Either.right(body));
              validator = jest.fn().mockImplementation((body: UserBody) => Either.right(body));
              authorizationValidator = jest.fn().mockReturnValue(validator);
              sanitizeEntity = jest.fn().mockImplementation((user: User) => user.get({ plain: true }));

              updateUserExecutor = jest.fn().mockResolvedValue(Either.right(user));
              userService = {
                updateUser: jest.fn().mockImplementation(() => updateUserExecutor)
              };

              await updateUserUnbound
                .apply(null, [bodyValidator, authorizationValidator, sanitizeEntity])
                .apply(null, [userService])
                .apply(null, [context, req, null]);
            });

            it('Should validate body as first', async () => {
              expect(bodyValidator)
                .toHaveBeenCalledTimes(1);
              expect(bodyValidator)
                .toHaveBeenCalledWith(req.body);
            });

            it('Should authorized user, after body has been validated', () => {
              expect(authorizationValidator)
                .toHaveBeenCalledTimes(1);
              expect(authorizationValidator)
                .toHaveBeenCalledWith(user, user);

              expect(validator)
                .toHaveBeenCalledTimes(1);
              expect(validator)
                .toHaveBeenCalledWith(req.body);

              expect(validator)
                .toHaveBeenCalledAfter(bodyValidator);
            });

            it('Should update user items, after body has been validated', () => {
              expect(spyOnUserSet)
                .toHaveBeenCalledTimes(1);
              expect(spyOnUserSet)
                .toHaveBeenCalledWith(req.body);
            });

            it('Should call exact user service, after items has been seted', () => {
              expect(userService.updateUser)
                .toHaveBeenCalledTimes(1);
              expect(userService.updateUser)
                .toHaveBeenCalledWith();

              expect(updateUserExecutor)
                .toHaveBeenCalledTimes(1);
              expect(updateUserExecutor)
                .toHaveBeenNthCalledWith(1, user.get());
            });

            it('Should sanitize user model, after service has been called', () => {
              expect(sanitizeEntity)
                .toHaveBeenCalledTimes(2);
              expect(sanitizeEntity)
                .toHaveBeenNthCalledWith(2, user);
            });
          });
        });
      });
    });
  });
});
