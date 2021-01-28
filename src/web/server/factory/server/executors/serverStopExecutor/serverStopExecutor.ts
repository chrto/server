import serverStopExecutorUbound from './serverStopExecutor.ubound';
import logger from 'utils/logger';

const message: string = 'server listener has been closed';
export default serverStopExecutorUbound.apply(null, [logger, message]);
