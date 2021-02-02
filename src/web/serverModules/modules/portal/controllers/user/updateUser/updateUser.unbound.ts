import { asyncBind, bind, eitherify, lift } from 'utils/either';
import { UserService } from 'service/sequelize/userService/userService';
import { Response } from 'express';
import { Either } from 'tsmonad';
import { User as PortalUser } from 'model/sequelize/user/user';
import { AppError } from 'common/error';
import { AppRequest } from 'web/serverModules/types';
import { Context as PortalContext } from './../../../context/context.types';
import { UserBody } from './updateUser.types';
import { Fcn } from 'common/types';
import { RequestImplicits } from '../../../paramHandlers/paramHandlers.types';

const setModel = (user: PortalUser) => (body: UserBody) => user.set(body);

export default (
  bodyValidator: Fcn<[UserBody], Either<AppError, UserBody>>,
  authorizationValidator: Fcn<[PortalUser, PortalUser], Fcn<[UserBody], Either<AppError, UserBody>>>,
  sanitizeEntity: Fcn<[PortalUser], any>
) =>
  ({ updateUser }: UserService) =>
    async (ctx: PortalContext, req: AppRequest<unknown, UserBody, PortalUser, RequestImplicits>, _res: Response): Promise<Either<AppError, PortalUser>> =>
      Promise.resolve(Either.right<AppError, UserBody>(req.body))
        .then(bind<UserBody, UserBody>(bodyValidator))
        .then(bind<UserBody, UserBody>(authorizationValidator(ctx.implicits.user, ctx.loggedInUser)))
        .then(bind<UserBody, PortalUser>(eitherify(setModel(ctx.implicits.user))))
        .then(asyncBind<PortalUser, PortalUser>(updateUser()))
        .then(lift(sanitizeEntity));
