import userParamHandlerUnbound from './userParamHandler.unbound';
import { AppError } from 'common/error';
import { NextFunction, Response } from 'express';
import { User } from 'model/sequelize/user/user';
import { UserService } from 'service/sequelize/userService';
import { Either } from 'tsmonad';
import { AppRequest } from 'web/serverModules/types';
import { RequestImplicits } from '../paramHandlers.types';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { InvalidInput } from 'common/httpErrors';

type LeftSideExecutor = jest.Mock<void, [AppError]>;
type RightSideExecutor = jest.Mock<void, [User]>;

const USER_ID: string = '0a0b44eb-97ed-4f41-bbf1-fe01e93efb34';
const USER: User = {
  id: USER_ID,
  email: 'joe.doe@company.com'
} as User;

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Portal', () => {
      describe('Request parameter handlers', () => {
        describe('User', () => {
          let leftSideExecutor: LeftSideExecutor;
          let handleError: jest.Mock<LeftSideExecutor, [AppRequest<unknown, unknown, User, RequestImplicits>, Response, NextFunction, string]>;
          let rightSideExecutor: RightSideExecutor;
          let addEntityInToRequestImplicits: jest.Mock<RightSideExecutor, [AppRequest<unknown, unknown, User, RequestImplicits>, Response, NextFunction, string]>;
          let isUuid: jest.Mock<boolean, [any]>;

          let serviceExecutro: jest.Mock<Promise<Either<AppError, User>>, [string]>;
          let userService: UserService = {} as UserService;

          beforeAll(() => {
            leftSideExecutor = jest.fn().mockReturnValue(null);
            handleError = jest.fn().mockReturnValue(leftSideExecutor);
            rightSideExecutor = jest.fn().mockReturnValue(null);
            addEntityInToRequestImplicits = jest.fn().mockReturnValue(rightSideExecutor);
            isUuid = jest.fn().mockReturnValue(true);

            serviceExecutro = jest.fn().mockResolvedValue(Either.right(USER));
            userService.getUserById = jest.fn().mockReturnValue(serviceExecutro);
          });

          describe('Happy path', () => {
            beforeAll(async () => {
              jest.clearAllMocks();
              await userParamHandlerUnbound
                .apply(null, [addEntityInToRequestImplicits, handleError, isUuid])
                .apply(null, [{ userService } as PluginSdkService])
                .apply(null, [null, null, null, USER_ID]);
            });

            it(`Should check, if user id is valid uuid format`, () => {
              expect(isUuid)
                .toHaveBeenCalledTimes(1);
              expect(isUuid)
                .toHaveBeenCalledWith(USER_ID);
            });

            it(`Should call userService, if uuid format check has been passed`, () => {
              expect(userService.getUserById)
                .toHaveBeenCalledTimes(1);
              expect(userService.getUserById)
                .toHaveBeenCalledWith();
              expect(serviceExecutro)
                .toHaveBeenCalledTimes(1);
              expect(serviceExecutro)
                .toHaveBeenCalledWith(USER_ID);

              expect(serviceExecutro)
                .toHaveBeenCalledAfter(isUuid);
            });

            it(`Should handle Either right side branch`, () => {
              expect(addEntityInToRequestImplicits)
                .toHaveBeenCalledTimes(1);
              expect(addEntityInToRequestImplicits)
                .toHaveBeenCalledWith(null, null, null, 'user');
              expect(rightSideExecutor)
                .toHaveBeenCalledTimes(1);
              expect(rightSideExecutor)
                .toHaveBeenCalledWith(USER);

              expect(rightSideExecutor)
                .toHaveBeenCalledAfter(serviceExecutro);

              expect(leftSideExecutor)
                .toHaveBeenCalledTimes(0);
            });
          });

          describe('Error path', () => {
            describe('user id check failed', () => {
              beforeAll(async () => {
                jest.clearAllMocks();
                isUuid = jest.fn().mockReturnValue(false);
                await userParamHandlerUnbound
                  .apply(null, [addEntityInToRequestImplicits, handleError, isUuid])
                  .apply(null, [{ userService } as PluginSdkService])
                  .apply(null, [null, null, null, USER_ID]);
              });

              it('Should not continue in chain execution, if uuid check has not been passed', () => {
                expect(isUuid)
                  .toHaveBeenCalledTimes(1);
                expect(serviceExecutro)
                  .toHaveBeenCalledTimes(0);
              });

              it('Should handle Either left side branch, with exact error', () => {
                expect(rightSideExecutor)
                  .toHaveBeenCalledTimes(0);
                expect(leftSideExecutor)
                  .toHaveBeenCalledTimes(1);
                expect(leftSideExecutor)
                  .toHaveBeenCalledWith(new InvalidInput(`userId ${USER_ID} is not valid uuid`));
              });
            });

            describe('user service failed', () => {
              const error: AppError = new AppError('server.error', 'server error');
              beforeAll(async () => {
                jest.clearAllMocks();
                isUuid = jest.fn().mockReturnValue(true);
                serviceExecutro = jest.fn().mockResolvedValue(Either.left(error));
                userService.getUserById = jest.fn().mockReturnValue(serviceExecutro);

                await userParamHandlerUnbound
                  .apply(null, [addEntityInToRequestImplicits, handleError, isUuid])
                  .apply(null, [{ userService } as PluginSdkService])
                  .apply(null, [null, null, null, USER_ID]);
              });

              it('Should handle Either left side branch, with exact error', () => {
                expect(rightSideExecutor)
                  .toHaveBeenCalledTimes(0);
                expect(leftSideExecutor)
                  .toHaveBeenCalledTimes(1);
                expect(leftSideExecutor)
                  .toHaveBeenCalledWith(error);
              });
            });
          });
        });
      });
    });
  });
});
