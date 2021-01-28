import startUnbound from './start.unbound';
import serverStartExecutor from '../../executors/serverStartExecutor/serverStartExecutor';
import shutdownListener from '../../executors/shutdownListener/shutdownListener';
import retry from 'utils/retry';

export default startUnbound.apply(null, [retry, serverStartExecutor, shutdownListener]);
