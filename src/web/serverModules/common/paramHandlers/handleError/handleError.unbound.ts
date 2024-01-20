import { AppError } from 'common/error';
import { NotFound } from 'common/httpErrors';
import { Predicate } from 'common/types';
import { NextFunction } from 'express';
import { AppRequest } from 'web/serverModules/types';

export default (isMissing: Predicate<string>) =>
  <UT>(_request: AppRequest<UT>, _response: Response, next: NextFunction, errMessage?: string) =>
    (error: AppError) =>
      error instanceof NotFound && !isMissing(errMessage)
        ? next(new NotFound(errMessage))
        : next(error);
