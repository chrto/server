import caseOf from 'utils/monad/either/caseOf/caseOf';
import bind from 'utils/monad/either/bind/bind';
import asyncBind from 'utils/monad/either/asyncBind/asyncBind';
import { makeSure } from 'utils/either';
import { Either } from 'tsmonad';
import { NextFunction, Response } from 'express';
import { AppError } from 'common/error';
import { InvalidInput } from 'common/httpErrors';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { AppRequest } from 'web/serverModules/types';
import { RequestImplicits } from '../paramHandlers.types';
import { Fcn } from 'common/types';
import { User as PortalUser } from 'model/sequelize/model/user/user';

export default (
  addEntityInToRequestImplicits: Fcn<[AppRequest<unknown, unknown, unknown, RequestImplicits>, Response, NextFunction, string], Fcn<[PortalUser], void>>,
  handleError: Fcn<[AppRequest<unknown, unknown, unknown, RequestImplicits>, Response, NextFunction, string], Fcn<[AppError], void>>,
  isUuid: Fcn<[any], boolean>
) =>
  ({ userService }: PluginSdkService) =>
    async (request: AppRequest<unknown, unknown, unknown, RequestImplicits>, response: Response, next: NextFunction, userId: string): Promise<void> =>
      Promise.resolve(Either.right<AppError, string>(userId))
        .then(bind(makeSure(isUuid, new InvalidInput(`userId ${userId} is not valid uuid`))))
        .then(asyncBind(userService.getUserById()))
        .then(caseOf({
          right: addEntityInToRequestImplicits(request, response, next, 'user'),
          left: handleError(request, response, next, `User with userId ${userId} not found`)
        }))
        .catch(next);
