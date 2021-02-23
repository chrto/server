import doer from 'utils/monad/either/do/doer';
import caseOf from 'utils/monad/either/caseOf/caseOf';
import { AppError } from 'common/error';
import { NotAuthorized } from 'common/httpErrors';
import { Fcn } from 'common/types';
import { NextFunction, Response } from 'express';
import { Either, Maybe } from 'tsmonad';
import { AppRequest } from 'web/serverModules/types';
import { Logger } from 'winston';
import { Handler, ContextCreator } from '../../registerRoutes.types';

export default (logger: Logger) =>
  <CTX, RB> (handler: Handler<CTX>, contextCreator: ContextCreator<CTX>, sendResponse: Fcn<[Response<RB>], Fcn<[RB], Response<RB>>>) =>
    (req: AppRequest, res: Response<RB>, next: NextFunction): Promise<void> =>
      Promise.resolve(contextCreator(req))
        .then((context: CTX): Promise<void> =>
          Promise.resolve(handler.authorization(context))
            .then((maybeError: Maybe<string>): Promise<Either<AppError, RB>> =>
              maybeError.caseOf({
                just: (errorMsg: string): Promise<Either<AppError, RB>> => Promise.resolve(Either.left<AppError, RB>(new NotAuthorized(errorMsg))),
                nothing: (): Promise<Either<AppError, RB>> => handler.action(context, req, res)
              }))
            .then(doer({
              right: (body: RB) => sendResponse(res)(body),
              left: (error: AppError) => logger.error(`error while handling request ${req.path}: ${JSON.stringify(error)}`)
            }))
            .then(caseOf({
              right: () => next(),
              left: next
            }))
            .catch(next));
