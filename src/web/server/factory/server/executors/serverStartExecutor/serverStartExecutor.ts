import startServerExecutorUnbound from './serverStartExecutor.unbound';
import appLogger from 'logger/appLogger';

export default startServerExecutorUnbound.apply(null, [appLogger]);
