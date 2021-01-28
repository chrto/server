import { RequestHandler } from 'express';
import { json as bodyParser, OptionsJson } from 'body-parser';

export default (jsonBodyParser: typeof bodyParser) =>
  (options: OptionsJson): RequestHandler =>
    jsonBodyParser(options);
