import expressLogger from './expressLogger/expressLogger';
import expressErrorLogger from './expressErrorLogger/expressErrorLogger';
import { ExpressLogger } from './logger.types';

const loggerMiddleware: ExpressLogger = { expressErrorLogger, expressLogger };
export default loggerMiddleware;
