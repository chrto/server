import { OptionsJson, OptionsUrlencoded } from 'body-parser';
import { Fcn } from 'common/types';
import { RequestHandler } from 'express';

export interface BodyParser {
  json: Fcn<[OptionsJson], RequestHandler>;
  urlencoded: Fcn<[OptionsUrlencoded], RequestHandler>;
}
