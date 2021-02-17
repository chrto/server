import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { FSReadOptions, FSPath, FSWriteOptions } from './file.types';
import readFileString from './readFile/readFileString';
import readFile from './readFile/readFile';
import writeFile from './writeFile/writeFile';

const DEFAUTL_ENCODING = 'utf8';

export default ({
  readFileString: (path: FSPath, encoding: string = DEFAUTL_ENCODING): Promise<Either<AppError, string>> =>
    readFileString(path, encoding),

  readFileBuffer: (path: FSPath, options?: FSReadOptions): Promise<Either<AppError, Buffer>> =>
    readFile(path, options),

  writeFile: (path: FSPath, data: any, options: FSWriteOptions | string): Promise<Either<AppError, void>> =>
    writeFile(path, data, options)
});
