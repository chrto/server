import createUserUnbound from './createUser.unbound';
import * as EmailValidator from './validator/emailNotExists';
import initUserModel, { User } from 'model/sequelize/user/user';
import { Response } from 'express';
import { UserItems, UserRequired, UserRole } from 'model/sequelize/user/user.types';
import { Sequelize } from 'sequelize';
import { DEFAULT_DB_DIALECT } from 'src/defaults';
import { UserBody } from './createUser.types';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { AppRequest } from 'web/serverModules/types';
import { RequestImplicits } from '../../../paramHandlers/paramHandlers.types';
import { UserService } from 'service/sequelize/userService';
import { Fcn } from 'common/types';
import { NotFound } from 'common/httpErrors';

type BodyValidator = jest.Mock<Either<AppError, UserBody>, [UserBody]>;
type AppReq = AppRequest<unknown, UserBody, User, RequestImplicits>;
const UUID: string = '92b814ed-1aff-46c1-b669-0c9fd2ea81a3';
const USER_REQUIRED: UserRequired = {
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe.doe@company.com'
};

const BODY: UserBody = USER_REQUIRED;

const USER_ITEMS: UserItems = {
  id: UUID,
  active: true,
  role: UserRole.User,
  ...USER_REQUIRED
};

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Portal', () => {
      describe('controller', () => {
        describe('user controller', () => {
          describe('create user', () => {
            let res: Partial<Response>;
            let req: AppReq;
            let bodyValidator: BodyValidator;
            let spiedEmailValidator: jest.SpyInstance<Fcn<[UserBody], Promise<Either<AppError, UserBody>>>, [Partial<UserService>]>;
            let userFactory: jest.Mock<Either<AppError, UserItems>, [UserRequired]>;
            let sequelize: Sequelize;
            let user: User;
            let sanitizeEntity: jest.Mock<any, [User]>;
            let userService: Partial<UserService> = {};
            let createUserExecutor: jest.Mock<Promise<Either<AppError, User>>, [UserRequired]>;
            let getUserExecutor: jest.Mock<Promise<Either<AppError, User>>, [string]>;

            beforeAll(async () => {
              req = {
                body: BODY
              } as AppReq;

              res = {
                status: jest.fn().mockReturnThis()
              };
              sequelize = new Sequelize(null, null, null, { dialect: DEFAULT_DB_DIALECT });
              initUserModel(sequelize);

              user = User.build(USER_ITEMS);

              bodyValidator = jest.fn().mockImplementation((body: UserBody) => Either.right(body));
              spiedEmailValidator = jest.spyOn(EmailValidator, 'default');
              sanitizeEntity = jest.fn().mockImplementation((user: User) => user.get({ plain: true }));
              createUserExecutor = jest.fn().mockResolvedValue(Either.right(user));
              getUserExecutor = jest.fn().mockResolvedValue(Either.left(new NotFound('')));
              userFactory = jest.fn().mockReturnValue(Either.right(USER_ITEMS));

              userService.getUserByEmail = jest.fn().mockImplementation(() => getUserExecutor);
              userService.createUser = jest.fn().mockImplementation(() => createUserExecutor);

              await createUserUnbound
                .apply(null, [bodyValidator, spiedEmailValidator, userFactory, sanitizeEntity])
                .apply(null, [userService])
                .apply(null, [null, req, res]);
            });

            it('Should validate body as first', () => {
              expect(bodyValidator)
                .toHaveBeenCalledTimes(1);
              expect(bodyValidator)
                .toHaveBeenCalledWith(req.body);
            });

            it('Should validate email address, after body has been validated', () => {
              expect(spiedEmailValidator)
                .toHaveBeenCalledTimes(1);
              expect(spiedEmailValidator)
                .toHaveBeenCalledWith({ getUserByEmail: userService.getUserByEmail });

              expect(userService.getUserByEmail)
                .toHaveBeenCalledTimes(1);
              expect(userService.getUserByEmail)
                .toHaveBeenCalledWith();

              expect(getUserExecutor)
                .toHaveBeenCalledTimes(1);
              expect(getUserExecutor)
                .toHaveBeenCalledWith(BODY.email);
            });

            it('Should calculate default user items, after body has been validated', async () => {
              expect(userFactory)
                .toHaveBeenCalledTimes(1);
              expect(userFactory)
                .toHaveBeenCalledWith(req.body);
            });

            it('Should create new user in DB (call service), after validation has been passed', async () => {
              expect(userService.createUser)
                .toHaveBeenCalledTimes(1);
              expect(userService.createUser)
                .toHaveBeenCalledWith();

              expect(createUserExecutor)
                .toHaveBeenCalledTimes(1);
              expect(createUserExecutor)
                .toHaveBeenCalledWith(USER_ITEMS);

              expect(createUserExecutor)
                .toHaveBeenCalledAfter(userFactory);
            });

            it('Should sanitize response and set response status to code 201', async () => {
              expect(res.status)
                .toHaveBeenCalledTimes(1);
              expect(res.status)
                .toHaveBeenCalledWith(201);

              expect(sanitizeEntity)
                .toHaveBeenCalledTimes(1);
              expect(sanitizeEntity)
                .toHaveBeenCalledWith(user);
            });
          });
        });
      });
    });
  });
});
