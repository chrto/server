import { User as PortalUser } from 'model/sequelize/model/user/user';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { Response } from 'express';
import { AppRequest } from 'web/serverModules/types';
import { Context as PortalContext } from './../../../context/context.types';
import { Fcn } from 'common/types';
import { Model } from 'sequelize/types';
import { RequestImplicits } from '../../../paramHandlers/paramHandlers.types';

export default (
  sanitizeEntity: Fcn<[Model<PortalUser>], any>
) => async (ctx: PortalContext, _req: AppRequest<unknown, unknown, PortalUser, RequestImplicits>, _res: Response): Promise<Either<AppError, PortalUser>> =>
    Either.right<AppError, PortalUser>(ctx.implicits.user)
      .lift(sanitizeEntity);
