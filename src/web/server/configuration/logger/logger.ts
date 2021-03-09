import appLogger from 'logger/appLogger';
import configLogger from './logger.unbound';

export default configLogger.apply(null, [appLogger]);
