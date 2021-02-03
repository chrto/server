import { User as PortalUser } from 'model/sequelize/model/user/user';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { DeletedUser } from './deleteUser.types';
import { AppRequest } from 'web/serverModules/types';
import { RequestImplicits } from '../../../paramHandlers/paramHandlers.types';
import { Context as PortalContext } from './../../../context/context.types';
import { asyncBind, bind, lift, makeSure } from 'utils/either';
import { NotAuthorized } from 'common/httpErrors';
import { Fcn } from 'common/types';
import { UserService } from 'service/sequelize/userService/userService.types';

export default (isDifferentUser: Fcn<[PortalUser, PortalUser], boolean>) =>
  ({ deleteUser }: UserService) =>
    async (ctx: PortalContext, _req: AppRequest<unknown, unknown, PortalUser, RequestImplicits>, _res: Response): Promise<Either<AppError, DeletedUser>> =>
      Promise.resolve(Either.right(ctx.implicits.user))
        .then(bind(makeSure(isDifferentUser.bind(null, ctx.loggedInUser), new NotAuthorized('User cannot delete himself'))))
        .then(asyncBind(deleteUser()))
        .then(lift((): DeletedUser => ({ removedUserId: ctx.implicits.user.id })));
