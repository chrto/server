import { NotAuthenticated } from 'common/httpErrors';
import { NextFunction, Request, Response } from 'express';

export default (err: any, _req: Request, _res: Response, next: NextFunction): any =>
  err.status !== 401
    ? next(err)
    : next(new NotAuthenticated(err.message));
