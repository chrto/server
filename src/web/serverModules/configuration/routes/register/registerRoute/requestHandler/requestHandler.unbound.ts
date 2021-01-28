import { AppError } from 'common/error';
import { NotAuthorized } from 'common/httpErrors';
import { Fcn } from 'common/types';
import { NextFunction, Response } from 'express';
import { Either, Maybe } from 'tsmonad';
import { _do, _doVoid } from 'utils/either';
import { AppRequest } from 'web/serverModules/types';
import { Logger } from 'winston';
import { Handler, ContextCreator } from '../../registerRoutes.types';

export default (logger: Logger) =>
  <CTX, RB>(handler: Handler<CTX>, contextCreator: ContextCreator<CTX>, sendResponse: Fcn<[Response<RB>], Fcn<[RB], Response<RB>>>) =>
    (req: AppRequest, res: Response<RB>, next: NextFunction): Promise<void> =>
      Promise.resolve(contextCreator(req))
        .then((context: CTX): Promise<void> =>
          Promise.resolve(handler.authorization(context))
            .then((maybeError: Maybe<string>): Promise<Either<AppError, RB>> =>
              maybeError.caseOf({
                just: (errorMsg: string): Promise<Either<AppError, RB>> => Promise.resolve(Either.left<AppError, RB>(new NotAuthorized(errorMsg))),
                nothing: (): Promise<Either<AppError, RB>> => handler.action(context, req, res)
              }))
            .then(_doVoid({
              right: (body: RB): void => (
                sendResponse(res)(body),
                next()),
              left: (error: AppError): void => (
                logger.error(`error while handling request ${req.path}: ${JSON.stringify(error)}`),
                next(error))
            }))
            .catch(next));
