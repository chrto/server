import { Fcn } from 'common/types';
import { RequestHandler } from 'express';

export default (cors: Fcn<[], RequestHandler>): RequestHandler => cors();
