import { AppError } from 'common/error';
import { TokenSet as TokenSetModel } from 'model/authentication/tokenSet.types';
import { Either } from 'tsmonad';
import { AppRequest } from 'web/serverModules/types';
import { Context } from '../../context/context.types';
import { Response } from 'express';
import { TokenQueryParams } from './getTokenSet/getTokenSet.types';
import { TokenRefreshQueryParams } from './refreshTokenSet/refreshTokenSet.types';

export interface AuthenticationController {
  token: (ctx: Context, req: AppRequest<TokenQueryParams, unknown, unknown>, res: Response) => Promise<Either<AppError, TokenSetModel>>;
  refreshToken: (ctx: Context, req: AppRequest<TokenRefreshQueryParams, unknown, unknown>, res: Response) => Promise<Either<AppError, TokenSetModel>>;
}
