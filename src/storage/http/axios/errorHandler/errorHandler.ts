import errorHandlerUnbound from './errorHandler.unbound';
import logError from 'logger/logError';

export default errorHandlerUnbound.apply(null, [logError]);
