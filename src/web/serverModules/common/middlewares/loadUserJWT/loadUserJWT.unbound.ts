import { caseOf } from 'utils/either';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { AppRequest } from 'web/serverModules/types';
import { User as UserModel } from 'model/sequelize/model/user/user';
import { NextFunction, Response } from 'express';
import { AppError } from 'common/error';
import { UnauthorizedError } from 'express-jwt';
import { NotAuthorized, NotFound } from 'common/httpErrors';
import { Fcn } from 'common/types';

const handleError = (next: NextFunction, logError: Fcn<[string], <E>(e: E) => E>) =>
  (error: AppError | UnauthorizedError): void => {
    logError('[AUTHORIZATION]:')(error);
    error instanceof NotFound
      ? next(new NotAuthorized(error.message))
      : next(error);
  };

const addUserToReq = <UT>(req: AppRequest<unknown, unknown, UT>, next: NextFunction) => (user: UT): void => (req.currentUser = user, next());

export default (logError: Fcn<[string], <E>(e: E) => E>) =>
  ({ userService }: PluginSdkService) =>
    (req: AppRequest<unknown, unknown, UserModel>, _res: Response, next: NextFunction): Promise<void> =>
      userService.getUserByEmail()(req.jwt.preferred_username)
        .then(
          caseOf({
            right: addUserToReq(req, next),
            left: handleError(next, logError)
          })
        )
        .catch(handleError(next, logError));
