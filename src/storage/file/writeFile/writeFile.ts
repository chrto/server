import writeFileUnbound from './writeFile.unbound';
import callback from '../common/callback/callback';
import { writeFile } from 'fs-extra';

export default writeFileUnbound(writeFile, callback);
