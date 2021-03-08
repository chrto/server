import errorHandlerUnbound from './errorHandler.unbound';
import appLogger from 'logger/appLogger';

export default errorHandlerUnbound.apply(null, [appLogger, process]);
