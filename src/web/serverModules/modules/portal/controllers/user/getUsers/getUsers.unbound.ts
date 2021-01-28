import { UserService } from 'service/sequelize/userService';
import { AppRequest } from 'web/serverModules/types';
import { Context as PortalContext } from './../../../context/context.types';
import { User as PortalUser } from 'model/sequelize/user/user';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { Fcn } from 'common/types';
import { lift } from 'utils/either';

export default (
  sanitizeEntities: Fcn<[PortalUser[]], any[]>
) =>
  ({ getUsers }: UserService) =>
    async (_ctx: PortalContext, _req: AppRequest<unknown, unknown, PortalUser>, _res: Response): Promise<Either<AppError, PortalUser[]>> =>
      getUsers()()
        .then(lift(sanitizeEntities));
