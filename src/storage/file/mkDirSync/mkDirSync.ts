import mkDirSyncUnbound from './mkDirSync.unbound';
import { mkdirSync } from 'fs-extra';

export default mkDirSyncUnbound(mkdirSync);
