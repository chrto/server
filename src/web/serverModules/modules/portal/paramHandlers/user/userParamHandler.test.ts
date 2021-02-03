import userParamHandlerUnbound from './userParamHandler.unbound';
import { expect as expectChai } from 'chai';
import { AppError } from 'common/error';
import { NextFunction, Response } from 'express';
import { User } from 'model/sequelize/model/user/user';
import { UserService } from 'service/sequelize/userService/userService.types';
import { Either } from 'tsmonad';
import { AppRequest } from 'web/serverModules/types';
import { RequestImplicits } from '../paramHandlers.types';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import addEntityInToRequestImplicits from 'web/serverModules/common/paramHandlers/addEntityInToRequestImplicits/addEntityInToRequestImplicits';
import handleError from 'web/serverModules/common/paramHandlers/handleError/handleError';
import { isUuid } from 'utils/validation';
import { Fcn } from 'common/types';
import { InvalidInput } from 'common/httpErrors';

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
          let nextFunction: jest.Mock<void, [any]>;
          let serviceExecutro: jest.Mock<Promise<Either<AppError, User>>, [string]>;
          let userService: UserService = {} as UserService;
          let userParamHandler: Fcn<[AppRequest<unknown, unknown, User, RequestImplicits>, Response, NextFunction, string], Promise<void>>;

          beforeAll(() => {
            nextFunction = jest.fn().mockReturnValue(null);
            serviceExecutro = jest.fn().mockResolvedValue(Either.right(USER));
            userService.getUserById = jest.fn().mockReturnValue(serviceExecutro);

            userParamHandler = userParamHandlerUnbound
              .apply(null, [addEntityInToRequestImplicits, handleError, isUuid])
              .apply(null, [{ userService } as PluginSdkService]);
          });

          describe('Happy path', () => {
            let req: AppRequest<unknown, unknown, User, RequestImplicits> = {} as AppRequest<unknown, unknown, User, RequestImplicits>;
            beforeAll(async () => {
              jest.clearAllMocks();
              await userParamHandler(req, null, nextFunction, USER_ID);
            });

            it(`Should handle Either right side branch`, () => {
              expect(nextFunction)
                .toHaveBeenCalledTimes(1);
              expect(nextFunction)
                .toHaveBeenCalledWith();
            });

            it(`Should add user in to request implicits`, () => {
              expectChai(req)
                .to.haveOwnProperty('implicits');
              expectChai(req.implicits)
                .to.haveOwnProperty('user')
                .which.is.deep.equal(USER);
            });
          });

          describe('Error path', () => {
            describe('user id check failed', () => {
              const userId: string = 'wrong id format';
              beforeAll(async () => {
                jest.clearAllMocks();
                await userParamHandler(null, null, nextFunction, userId);
              });

              it(`Should handle Either left side branch and pass exact error in to next middleware`, () => {
                expect(nextFunction)
                  .toHaveBeenCalledTimes(1);
                expect(nextFunction)
                  .toHaveBeenCalledWith(new InvalidInput(`userId ${userId} is not valid uuid`));
              });
            });

            describe('user service failed', () => {
              const error: AppError = new AppError('server error', 'internal server error');

              beforeAll(async () => {
                jest.clearAllMocks();
                serviceExecutro = jest.fn().mockResolvedValue(Either.left(error));
                userService.getUserById = jest.fn().mockReturnValue(serviceExecutro);
                await userParamHandlerUnbound
                  .apply(null, [addEntityInToRequestImplicits, handleError, isUuid])
                  .apply(null, [{ userService } as PluginSdkService])
                  .apply(null, [null, null, nextFunction, USER_ID]);
              });

              it(`Should handle Either left side branch and pass exact error in to next middleware`, () => {
                expect(nextFunction)
                  .toHaveBeenCalledTimes(1);
                expect(nextFunction)
                  .toHaveBeenCalledWith(error);
              });
            });
          });
        });
      });
    });
  });
});
