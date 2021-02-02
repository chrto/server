import { RequestHandler } from 'express';
import { MiddlewareFactory } from '../middlewares.types';

export default (cors: MiddlewareFactory<void, RequestHandler>): RequestHandler => cors();
