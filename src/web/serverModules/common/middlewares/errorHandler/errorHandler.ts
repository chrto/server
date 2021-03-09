import appLogger from 'logger/appLogger';
import errorHandlerUnbound from './errorHandler.unbound';

export default errorHandlerUnbound.apply(null, [appLogger]);
