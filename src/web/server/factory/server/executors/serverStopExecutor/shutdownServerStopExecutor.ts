import serverStopExecutorUnbound from './serverStopExecutor.ubound';
import logger from 'utils/logger';

const message: string = 'shutdown listener has been closed';
export default serverStopExecutorUnbound.apply(null, [logger, message]);
