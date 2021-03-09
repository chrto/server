import mkDir from './mkDir';
import doer from 'utils/monad/either/do/doer';
import { WORK_DIR } from 'src/defaults';
import * as sniff from 'supersniff';
import { FSMKDirOptions } from '../file.types';

const OPTIONS: FSMKDirOptions = { recursive: true };
const DIR_PATH: string = `${WORK_DIR}src/storage/file/mkDir/REMOVE_ME/I/AM/TEST`;

mkDir(DIR_PATH, OPTIONS)
  .then(doer({
    right: () => sniff('SUCCESS'),
    left: sniff
  }));
