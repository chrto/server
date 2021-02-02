import loadUserJWTUnbound from './loadUserJWT.unbound';
import { expect as expectChai } from 'chai';
import { AppError } from 'common/error';
import { Fcn } from 'common/types';
import { NextFunction, RequestHandler } from 'express';
import { TransactionContext } from 'model/sequelize/modelFactory/modelFactory.types';
import { User as UserModel } from 'model/sequelize/user/user';
import { UserService } from 'service/sequelize/userService/userService.types';
import { Either } from 'tsmonad';
import { AppRequest } from 'web/serverModules/types';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { InternalServerError, NotAuthorized, NotFound } from 'common/httpErrors';
import { MiddlewareFactory } from '../middlewares.types';

const USERNAME: string = 'joe.doe@company.com';

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`middlewares`, () => {
      describe(`load authenticated user`, () => {
        let logError: Fcn<[string], <E>(e: E) => E>;
        let logger: <E>(e: E) => E;
        let userService: UserService = {} as UserService;
        let getUserByEmail: Fcn<[string], Promise<Either<AppError, UserModel>>>;
        let nextFcn: NextFunction;
        let loadUserJWT: MiddlewareFactory<PluginSdkService, RequestHandler>;

        beforeAll(() => {
          logger = jest.fn().mockImplementation(<E> (e: E): E => e);
          logError = jest.fn().mockImplementation((_message: string) => logger);
          nextFcn = jest.fn().mockReturnValue(null);
          loadUserJWT = loadUserJWTUnbound.apply(null, [logError]);
        });

        afterEach(() => {
          jest.clearAllMocks();
        });

        describe('Happy path', () => {
          const USER: UserModel = {} as UserModel;
          let request: AppRequest<unknown, unknown, UserModel> = {
            jwt: {
              preferred_username: USERNAME
            }
          } as AppRequest<unknown, unknown, UserModel>;

          beforeAll(() => {
            getUserByEmail = jest.fn().mockResolvedValue(Either.right<AppError, UserModel>(USER));
            userService.getUserByEmail = jest.fn().mockImplementation((_ctx: TransactionContext): Fcn<[string], Promise<Either<AppError, UserModel>>> => getUserByEmail);
          });
          it(`Should find authenticated user in locla DB and add him in to request`, () => {
            loadUserJWT
              .apply(null, [{ userService }])
              .apply(null, [request, null, nextFcn])
              .then(() => {
                expect(userService.getUserByEmail)
                  .toHaveBeenCalledWith();
                expect(getUserByEmail)
                  .toHaveBeenCalledWith(USERNAME);
                expect(nextFcn)
                  .toHaveBeenCalledWith();
                expect(logError)
                  .not.toHaveBeenCalled();
                expectChai(request)
                  .to.haveOwnProperty('currentUser')
                  .which.is.deep.equal(USER);
              });
          });
        });

        describe('Error path', () => {
          let request: AppRequest<unknown, unknown, UserModel> = {
            jwt: {
              preferred_username: USERNAME
            }
          } as AppRequest<unknown, unknown, UserModel>;
          describe('User not found', () => {
            const ERROR_NOT_FOUND: NotFound = new NotFound('user not found');
            beforeAll(() => {
              getUserByEmail = jest.fn().mockResolvedValue(Either.left<AppError, UserModel>(ERROR_NOT_FOUND));
              userService.getUserByEmail = jest.fn().mockImplementation((_ctx: TransactionContext): Fcn<[string], Promise<Either<AppError, UserModel>>> => getUserByEmail);
            });

            it(`Should log and shift exact error, if user is not found in DB`, () => {
              const expectedError: NotAuthorized = new NotAuthorized(ERROR_NOT_FOUND.message);
              loadUserJWT
                .apply(null, [{ userService }])
                .apply(null, [request, null, nextFcn])
                .then(() => {
                  expect(userService.getUserByEmail)
                    .toHaveBeenCalledWith();
                  expect(getUserByEmail)
                    .toHaveBeenCalledWith(USERNAME);
                  expect(nextFcn)
                    .toHaveBeenCalledWith(expectedError);
                  expect(logError)
                    .toHaveBeenCalledWith('[AUTHORIZATION]:');
                  expect(logger)
                    .toHaveBeenCalledWith(expectedError);
                  expectChai(request)
                    .to.not.haveOwnProperty('currentUser');
                });
            });
          });

          describe('error', () => {
            const ERROR: InternalServerError = new InternalServerError();
            beforeAll(() => {
              getUserByEmail = jest.fn().mockResolvedValue(Either.left<AppError, UserModel>(ERROR));
              userService.getUserByEmail = jest.fn().mockImplementation((_ctx: TransactionContext): Fcn<[string], Promise<Either<AppError, UserModel>>> => getUserByEmail);
            });

            it(`Should log and shift exact error, if user is not found in DB`, () => {
              loadUserJWT
                .apply(null, [{ userService }])
                .apply(null, [request, null, nextFcn])
                .then(() => {
                  expect(userService.getUserByEmail)
                    .toHaveBeenCalledWith();
                  expect(getUserByEmail)
                    .toHaveBeenCalledWith(USERNAME);
                  expect(nextFcn)
                    .toHaveBeenCalledWith(ERROR);
                  expect(logError)
                    .toHaveBeenCalledWith('[AUTHORIZATION]:');
                  expect(logger)
                    .toHaveBeenCalledWith(ERROR);
                  expectChai(request)
                    .to.not.haveOwnProperty('currentUser');
                });
            });
          });
        });
      });
    });
  });
});
