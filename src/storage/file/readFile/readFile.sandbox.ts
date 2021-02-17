import readFileString from './readFileString';
import { WORK_DIR } from 'src/defaults';
import { _do } from 'utils/either';
import * as sniff from 'supersniff';

const DEFAUTL_ENCODING: string = 'utf8';
const FILE_PATH: string = `${WORK_DIR}src/storage/file/readFile/readFile.ts`;

readFileString(FILE_PATH, DEFAUTL_ENCODING)
  .then(_do({
    right: sniff,
    left: sniff
  }));
