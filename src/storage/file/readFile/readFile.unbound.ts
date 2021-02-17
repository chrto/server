import { AppError } from 'common/error';
import { Fcn } from 'common/types';
import { Either } from 'tsmonad';
import { FSCallback, FSCallbackFactory, FSPromiseResolve } from '../common/callback/callback.types';
import { FSPath, FSReadOptions } from '../file.types';

export default <T, OP = FSReadOptions> (readFile: Fcn<[FSPath, OP, FSCallback<T>], void>, cbFactory: FSCallbackFactory<T>) =>
  (path: FSPath, options: OP): Promise<Either<AppError, T>> =>
    new Promise((resolve: FSPromiseResolve<T>) =>
      readFile(path, options, cbFactory(resolve)));
