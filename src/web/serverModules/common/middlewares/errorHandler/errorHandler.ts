import logger from 'utils/logger';
import errorHandlerUnbound from './errorHandler.unbound';

export default errorHandlerUnbound.apply(null, [logger]);
