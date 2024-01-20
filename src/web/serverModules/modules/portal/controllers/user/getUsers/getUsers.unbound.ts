import lift from 'utils/monad/either/lift/lift';
import { UserService } from 'service/sequelize/userService/userService.types';
import { Response } from 'express';
import { AppRequest } from 'web/serverModules/types';
import { Context as PortalContext } from './../../../context/context.types';
import { User as PortalUser } from 'model/sequelize/model/user/user';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { Fcn } from 'common/types';
import { RequestImplicits } from '../../../paramHandlers/paramHandlers.types';

export default (
  sanitizeEntities: Fcn<[PortalUser[]], any[]>
) =>
  ({ getUsers }: UserService) =>
    async (_ctx: PortalContext, _req: AppRequest<PortalUser, RequestImplicits>, _res: Response): Promise<Either<AppError, PortalUser[]>> =>
      getUsers()()
        .then(lift(sanitizeEntities));
