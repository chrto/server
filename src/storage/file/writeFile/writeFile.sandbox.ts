import writeFile from './writeFile';
import { WORK_DIR } from 'src/defaults';
import { _do } from 'utils/either';
import * as sniff from 'supersniff';
import { FSWriteOptions } from '../file.types';

const DEFAUTL_ENCODING: string = 'utf8';
const OPTIONS: FSWriteOptions = { encoding: DEFAUTL_ENCODING };
const DATA: any = JSON.stringify(OPTIONS);
const FILE_PATH: string = `${WORK_DIR}src/storage/file/writeFile/remove_me.json`;

writeFile(FILE_PATH, DATA, OPTIONS)
  .then(_do({
    right: () => sniff('SUCCESS'),
    left: sniff
  }));
