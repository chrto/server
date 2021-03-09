import { AppError } from 'common/error';
import { MakeDirectoryOptions, PathLike } from 'fs';
import { Mode, WriteFileOptions } from 'fs-extra';
import { Either } from 'tsmonad';

export type FSError = NodeJS.ErrnoException | null;
export type FSPath = PathLike | number;
export type FSReadOptions = { flag?: string; } | { encoding: string; flag?: string; };
export type FSWriteOptions = WriteFileOptions | string;
export type FSMKDirOptions = Mode | MakeDirectoryOptions | null;

export interface FileStorage {
  readFileString: (path: FSPath, encoding: string) => Promise<Either<AppError, string>>;
  readFileBuffer: (path: FSPath, options?: FSReadOptions) => Promise<Either<AppError, Buffer>>;
  writeFile: (path: FSPath, data: any, options: FSWriteOptions | string) => Promise<Either<AppError, void>>;
  mkDir: (path: FSPath, options?: FSMKDirOptions) => Promise<Either<AppError, void>>;
  mkDirSync: (path: FSPath, options?: FSMKDirOptions) => Either<AppError, void>;
}
