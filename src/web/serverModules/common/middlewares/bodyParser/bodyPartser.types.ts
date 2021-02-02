import { OptionsJson, OptionsUrlencoded } from 'body-parser';
import { RequestHandler } from 'express';
import { MiddlewareFactory } from '../middlewares.types';

export interface BodyParser {
  json: MiddlewareFactory<OptionsJson, RequestHandler>;
  urlencoded: MiddlewareFactory<OptionsUrlencoded, RequestHandler>;
}
