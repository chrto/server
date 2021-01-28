import { RequestHandler } from 'express';
import { urlencoded as bodyParser, OptionsUrlencoded } from 'body-parser';

export default (urlencodedBodyParser: typeof bodyParser) =>
  (options: OptionsUrlencoded): RequestHandler =>
    urlencodedBodyParser(options);
