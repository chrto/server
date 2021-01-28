import regiserRoutesUnbound from './registerRoutes.unbound';
import registerRoute from './registerRoute/registerRoute';
import { Response } from 'express';

const sendResult = (res: Response) => <T>(result: T): Response => res.send(result);

export default regiserRoutesUnbound.apply(null, [registerRoute, sendResult]);
