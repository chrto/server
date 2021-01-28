import { NextFunction, Response } from 'express';
import { AppRequest } from 'web/serverModules/types';

export default <UT, R_IML, K extends keyof R_IML>(request: AppRequest<unknown, unknown, UT, R_IML>, _response: Response, next: NextFunction, key: K) =>
  (entity: R_IML[K]): void => {
    request.implicits = {
      ...request.implicits,
      [key]: entity
    };
    next();
  };
