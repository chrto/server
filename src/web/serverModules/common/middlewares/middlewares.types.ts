import { ErrorRequestHandler, RequestHandler } from 'express';
import { RequestHandler as JwtRequestHandler } from 'express-jwt';
import { BodyParser } from './bodyParser/bodyPartser.types';
import { ExpressLogger } from './logger/logger.types';

export type Middleware = ErrorRequestHandler | RequestHandler | JwtRequestHandler;

export default interface Middlewares {
  cors: RequestHandler;
  bodyParser: BodyParser;
  authenticationErrorHandler: ErrorRequestHandler;
  errorHandler: ErrorRequestHandler;
  jwtAuthentication: JwtRequestHandler;
  loadUserJWT: RequestHandler;
  logger: ExpressLogger;
}
