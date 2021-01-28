import { AppError } from 'common/error';
import { NotFound } from 'common/httpErrors';
import { NextFunction } from 'express';
import { Pred } from 'ramda';
import { AppRequest } from 'web/serverModules/types';

export default (isMissing: Pred) =>
  <UT>(_request: AppRequest<unknown, unknown, UT>, _response: Response, next: NextFunction, errMessage?: string) =>
    (error: AppError) =>
      error instanceof NotFound && !isMissing(errMessage)
        ? next(new NotFound(errMessage))
        : next(error);
