import asyncBind from 'utils/monad/either/asyncBind/asyncBind';
import { AppError } from 'common/error';
import { Response } from 'express';
import { AuthenticationService } from 'service/http/authentication/types';
import { Either } from 'tsmonad';
import { AppRequest } from 'web/serverModules/types';
import { Context } from '../../../context/context.types';
import { TokenSet as TokenSetModel } from 'model/authentication/tokenSet.types';
import queryValidator from './validators/queryValidator';
import { TokenRefreshQueryParams } from './refreshTokenSet.types';

export default (authenticationService: AuthenticationService) =>
  async (_ctx: Context, req: AppRequest<unknown, unknown, TokenRefreshQueryParams>, _res: Response): Promise<Either<AppError, TokenSetModel>> =>
    Promise.resolve(queryValidator(req.query))
      .then(asyncBind(authenticationService.refreshTokens));
