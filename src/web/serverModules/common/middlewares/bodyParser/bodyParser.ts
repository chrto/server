import jsonBodyParser from './applicationJson/jsonBodyParser';
import urlencodedBodyParser from './applicationUrlencoded/urlencodedBodyParser';
import { BodyParser } from './bodyPartser.types';

const bodyParser: BodyParser = {
  json: jsonBodyParser,
  urlencoded: urlencodedBodyParser
};

export default bodyParser;
