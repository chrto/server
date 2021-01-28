import regiserRoutesUnbound from './registerRoutes.unbound';
import registerRoute from './registerRoute/registerRoute';
import { Response } from 'express';

const sendFile =  (res: Response) => (result: any) =>
  res.contentType('application/zip')
    .send(new Buffer(result.stream, 'binary'));

export default regiserRoutesUnbound.apply(null, [registerRoute, sendFile]);
