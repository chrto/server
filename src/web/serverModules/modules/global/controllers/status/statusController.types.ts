import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { Response } from 'express';
import { ServerStatus } from 'model/global/serverStatus/serverStatus.types';
import { AppRequest } from 'web/serverModules/types';
import { Context } from '../../context/context.types';

export interface StatusController {
  getStatus: (ctx: Context, req: AppRequest, res: Response) => Promise<Either<AppError, ServerStatus>>;
}
