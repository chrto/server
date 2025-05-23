import writeFile from './writeFile';
import doer from 'utils/monad/either/do/doer';
import { WORK_DIR } from 'src/defaults';
import * as sniff from 'supersniff';
import { FSWriteOptions } from '../file.types';

const OPTIONS: FSWriteOptions = { encoding: 'utf8' };
const DATA: any = JSON.stringify(OPTIONS);
const FILE_PATH: string = `${WORK_DIR}src/storage/file/writeFile/remove_me.json`;

writeFile(FILE_PATH, DATA, OPTIONS)
  .then(doer({
    right: () => sniff('SUCCESS'),
    left: sniff
  }));
