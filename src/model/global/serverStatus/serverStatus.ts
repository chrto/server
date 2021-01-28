import serverStatusUnbound from './serverStatus.unbound';
import version from 'src/utils/version';

export default serverStatusUnbound.apply(null, [version]);
