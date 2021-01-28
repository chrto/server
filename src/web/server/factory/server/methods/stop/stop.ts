import stopUnbound from './stop.unbound';
import { exit } from 'process';
import logger from 'utils/logger';
import serverStopExecutor from '../../executors/serverStopExecutor/serverStopExecutor';
import shutdownServerStopExecutor from '../../executors/serverStopExecutor/shutdownServerStopExecutor';

export default stopUnbound.apply(null, [logger, shutdownServerStopExecutor, serverStopExecutor, setTimeout, clearTimeout, exit]);
