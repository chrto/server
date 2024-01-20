import { AppError } from 'common/error';
import { User } from 'model/sequelize/model/user/user';
import { Either } from 'tsmonad';
import { AppRequest } from 'web/serverModules/types';
import { Context as PortalContext } from '../../context/context.types';
import { Response } from 'express';
import { RequestImplicits } from '../../paramHandlers/paramHandlers.types';
import { DeletedUser } from './deleteUser/deleteUser.types';
import { UserBody as UpdateUserBody } from './updateUser/updateUser.types';
import { UserBody as CreateUserBody } from './createUser/createUser.types';
import { Query } from "express-serve-static-core";

export interface UserController {
  getUserById: (ctx: PortalContext, req: AppRequest<User, RequestImplicits>, res: Response) => Promise<Either<AppError, User>>;
  deleteUser: (ctx: PortalContext, req: AppRequest<User, RequestImplicits>, res: Response) => Promise<Either<AppError, DeletedUser>>;
  updateUser: (ctx: PortalContext, req: AppRequest<User, RequestImplicits, Query, UpdateUserBody>, res: Response) => Promise<Either<AppError, User>>;
  getUsers: (ctx: PortalContext, req: AppRequest<User, RequestImplicits>, res: Response) => Promise<Either<AppError, User[]>>;
  createUser: (ctx: PortalContext, req: AppRequest<User, RequestImplicits, Query, CreateUserBody>, res: Response) => Promise<Either<AppError, User>>;
}
