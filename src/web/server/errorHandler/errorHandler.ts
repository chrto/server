import errorHandlerUnbound from './errorHandler.unbound';
import logger from 'utils/logger';

export default errorHandlerUnbound.apply(null, [logger, process]);
