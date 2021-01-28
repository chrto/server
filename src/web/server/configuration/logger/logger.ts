import logger from 'utils/logger';
import configLogger from './logger.unbound';

export default configLogger.apply(null, [logger]);
