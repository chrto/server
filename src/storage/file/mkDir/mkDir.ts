import mkDirUnbound from './mkDir.unbound';
import callback from '../common/callback/callback';
import { mkdir } from 'fs-extra';

export default mkDirUnbound(mkdir, callback);
