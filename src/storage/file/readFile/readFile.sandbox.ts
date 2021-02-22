import readFileString from './readFileString';
import doer from 'utils/monad/either/do/doer';
import { WORK_DIR } from 'src/defaults';
import * as sniff from 'supersniff';

const DEFAUTL_ENCODING: string = 'utf8';
const FILE_PATH: string = `${WORK_DIR}src/storage/file/readFile/readFile.ts`;

readFileString(FILE_PATH, DEFAUTL_ENCODING)
  .then(doer({
    right: sniff,
    left: sniff
  }));
