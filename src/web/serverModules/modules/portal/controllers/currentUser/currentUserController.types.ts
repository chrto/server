import { AppError } from "common/error";
import { User } from "model/sequelize/user/user";
import { Either } from "tsmonad";
import { AppRequest } from "web/serverModules/types";
import { Context } from "../../context/context.types";
import { Response } from 'express';

export interface CurrentUserController {
  getLoggedInUser: (ctx: Context, req: AppRequest<unknown, unknown, User>, res: Response) => Promise<Either<AppError, User>>;
}
