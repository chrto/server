import { ErrorRequestHandler, RequestHandler } from 'express';

export interface ExpressLogger {
  expressErrorLogger: ErrorRequestHandler;
  expressLogger: RequestHandler;
}
