import { UserService } from 'service/sequelize/userService/userService';
import { Response } from 'express';
import { AppRequest } from 'web/serverModules/types';
import { Context as PortalContext } from './../../../context/context.types';
import { User as PortalUser } from 'model/sequelize/user/user';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { Fcn } from 'common/types';
import { lift } from 'utils/either';
import { RequestImplicits } from '../../../paramHandlers/paramHandlers.types';

export default (
  sanitizeEntities: Fcn<[PortalUser[]], any[]>
) =>
  ({ getUsers }: UserService) =>
    async (_ctx: PortalContext, _req: AppRequest<unknown, unknown, PortalUser, RequestImplicits>, _res: Response): Promise<Either<AppError, PortalUser[]>> =>
      getUsers()()
        .then(lift(sanitizeEntities));
