import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { FSReadOptions, FSPath, FSWriteOptions, FSMKDirOptions, FileStorage } from './file.types';
import readFileString from './readFile/readFileString';
import readFile from './readFile/readFile';
import writeFile from './writeFile/writeFile';
import mkDir from './mkDir/mkDir';
import mkDirSync from './mkDirSync/mkDirSync';

const DEFAUTL_ENCODING = 'utf8';

const fileStorage: FileStorage = {
  readFileString: async (path: FSPath, encoding: string = DEFAUTL_ENCODING): Promise<Either<AppError, string>> =>
    readFileString(path, encoding),

  readFileBuffer: async (path: FSPath, options?: FSReadOptions): Promise<Either<AppError, Buffer>> =>
    readFile(path, options),

  writeFile: async (path: FSPath, data: any, options: FSWriteOptions | string): Promise<Either<AppError, void>> =>
    writeFile(path, data, options),

  mkDir: async (path: FSPath, options?: FSMKDirOptions): Promise<Either<AppError, void>> =>
    mkDir(path, options),

  mkDirSync: (path: FSPath, options?: FSMKDirOptions): Either<AppError, void> =>
    mkDirSync(path, options)
};

export default fileStorage;
