import { Context } from '../../../context/context.types';
import { TokenSet as TokenSetModel } from 'model/authentication/tokenSet.types';
import { Response } from 'express';
import { AppRequest } from 'web/serverModules/types';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import queryValidator from './validators/queryValidator';
import { asyncBind } from 'utils/either';
import { AuthenticationService } from 'service/http/authentication/types';
import { TokenQueryParams } from './getTokenSet.types';

export default (authenticationService: AuthenticationService) =>
  async (_ctx: Context, req: AppRequest<TokenQueryParams, unknown, unknown>, _res: Response): Promise<Either<AppError, TokenSetModel>> =>
    Promise.resolve(queryValidator(req.query))
      .then(asyncBind(authenticationService.getTokensSet));
