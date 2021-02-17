import readFileUnbound from './readFile.unbound';
import { readFile } from 'fs-extra';
import callback from '../common/callback/callback';

export default readFileUnbound<Buffer>(readFile, callback);
