import mkDirSync from './mkDirSync';
import { WORK_DIR } from 'src/defaults';
import * as sniff from 'supersniff';
import { FSMKDirOptions } from '../file.types';

const OPTIONS: FSMKDirOptions = { recursive: true };
const DIR_PATH: string = `${WORK_DIR}src/storage/file/mkDirSync/REMOVE_ME/I/AM/TEST`;

mkDirSync(DIR_PATH, OPTIONS)
  .do({
    right: () => sniff('SUCCESS'),
    left: sniff
  });
