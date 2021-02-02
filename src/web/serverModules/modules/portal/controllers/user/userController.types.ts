import { AppError } from 'common/error';
import { User } from 'model/sequelize/user/user';
import { Either } from 'tsmonad';
import { AppRequest } from 'web/serverModules/types';
import { Context as PortalContext } from '../../context/context.types';
import { Response } from 'express';
import { RequestImplicits } from '../../paramHandlers/paramHandlers.types';
import { DeletedUser } from './deleteUser/deleteUser.types';
import { UserBody as UpdateUserBody } from './updateUser/updateUser.types';
import { UserBody as CreateUserBody } from './createUser/createUser.types';

export interface UserController {
  getUserById: (ctx: PortalContext, req: AppRequest<unknown, unknown, User, RequestImplicits>, res: Response) => Promise<Either<AppError, User>>;
  deleteUser: (ctx: PortalContext, req: AppRequest<unknown, unknown, User, RequestImplicits>, res: Response) => Promise<Either<AppError, DeletedUser>>;
  updateUser: (ctx: PortalContext, req: AppRequest<unknown, UpdateUserBody, User, RequestImplicits>, res: Response) => Promise<Either<AppError, User>>;
  getUsers: (ctx: PortalContext, req: AppRequest<unknown, unknown, User, RequestImplicits>, res: Response) => Promise<Either<AppError, User[]>>;
  createUser: (ctx: PortalContext, req: AppRequest<unknown, CreateUserBody, User, RequestImplicits>, res: Response) => Promise<Either<AppError, User>>;
}
