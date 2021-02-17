import { AppError } from 'common/error';
import { Fcn } from 'common/types';
import { Either } from 'tsmonad';
import { FSCallback, FSCallbackFactory, FSPromiseResolve } from '../common/callback/callback.types';
import { FSPath, FSWriteOptions } from '../file.types';

export default (writeFile: Fcn<[FSPath, any, FSWriteOptions, FSCallback<void>], void>, cbFactory: FSCallbackFactory<void>) =>
  (path: FSPath, data: any, options: FSWriteOptions): Promise<Either<AppError, void>> =>
    new Promise((resolve: FSPromiseResolve<void>) =>
      writeFile(path, data, options, cbFactory(resolve)));
