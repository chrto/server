import serverStopExecutorUbound from './serverStopExecutor.ubound';
import appLogger from 'logger/appLogger';

const message: string = 'server listener has been closed';
export default serverStopExecutorUbound.apply(null, [appLogger, message]);
