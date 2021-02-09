import errorHandlerUnbound from './errorHandler.unbound';
import { logError } from 'utils/logger';

export default errorHandlerUnbound.apply(null, [logError]);
