import serverStopExecutorUnbound from './serverStopExecutor.ubound';
import appLogger from 'logger/appLogger';

const message: string = 'shutdown listener has been closed';
export default serverStopExecutorUnbound.apply(null, [appLogger, message]);
