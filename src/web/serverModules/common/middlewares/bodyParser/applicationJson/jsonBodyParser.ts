import bodyParserUnbound from './jsonBodyParser.unbound';
import * as express from 'express';

export default bodyParserUnbound.apply(null, [express.json]);
