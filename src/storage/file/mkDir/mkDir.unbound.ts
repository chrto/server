import { AppError } from 'common/error';
import { Fcn } from 'common/types';
import { Either } from 'tsmonad';
import { FSCallback, FSCallbackFactory, FSPromiseResolve } from '../common/callback/callback.types';
import { FSPath, FSMKDirOptions } from '../file.types';

export default (mkDir: Fcn<[FSPath, FSMKDirOptions, FSCallback<void>], void>, cbFactory: FSCallbackFactory<void>) =>
  (path: FSPath, options: FSMKDirOptions): Promise<Either<AppError, void>> =>
    new Promise((resolve: FSPromiseResolve<void>) =>
      mkDir(path, options, cbFactory(resolve)));
