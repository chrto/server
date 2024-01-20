import readFileUnbound from './readFile.unbound';
import { readFile } from 'fs-extra';
import callback from '../common/callback/callback';
import { FSReadTextOptions } from '../file.types';

export default readFileUnbound<string, FSReadTextOptions>(readFile, callback);
