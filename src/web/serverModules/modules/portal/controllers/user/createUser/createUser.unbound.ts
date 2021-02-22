import bind from 'utils/either/bind/bind';
import asyncBind from 'utils/either/asyncBind/asyncBind';
import lift from 'utils/either/lift/lift';
import { Either } from 'tsmonad';
import { Response } from 'express';
import { UserService } from 'service/sequelize/userService/userService.types';
import { AppRequest } from 'web/serverModules/types';
import { Context as PortalContext } from './../../../context/context.types';
import { UserBody } from './createUser.types';
import { User as PortalUser } from 'model/sequelize/model/user/user';
import { AppError } from 'common/error';
import { Fcn } from 'common/types';
import { UserItems, UserRequired } from 'model/sequelize/model/user/user.types';
import { RequestImplicits } from '../../../paramHandlers/paramHandlers.types';

export default (
  bodyValidator: Fcn<[UserBody], Either<AppError, UserBody>>,
  emailNotExistsValidator: Fcn<[Partial<UserService>], Fcn<[UserBody], Promise<Either<AppError, UserBody>>>>,
  userFactory: Fcn<[UserRequired], Either<AppError, UserItems>>,
  sanitizeEntity: Fcn<[PortalUser], any>
) =>
  ({ createUser, getUserByEmail }: UserService) =>
    async (_ctx: PortalContext, req: AppRequest<unknown, UserBody, PortalUser, RequestImplicits>, res: Response): Promise<Either<AppError, PortalUser>> =>
      Promise.resolve(Either.right<AppError, UserBody>(req.body))
        .then(bind(bodyValidator))
        .then(asyncBind(emailNotExistsValidator({ getUserByEmail })))
        .then(bind(userFactory))
        .then(asyncBind(createUser()))
        .then(lift((user: PortalUser): PortalUser => res.status(201) && sanitizeEntity(user)));
