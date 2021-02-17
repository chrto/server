import { Either } from 'tsmonad';
import { FSError } from 'storage/file/file.types';
import { AppError } from 'common/error';
import { InternalServerError } from 'common/httpErrors';
import { Fcn } from 'common/types';
import { FSPromiseResolve } from './callback.types';

const appErrorFactory = (error: FSError): AppError =>
  error.message && error.code ? new AppError(error.code, error.message) : new InternalServerError();

export default (isMissing: Fcn<[FSError], boolean>) =>
  <T> (resolve: FSPromiseResolve<T>) =>
    (err: FSError, content: T): void => {
      isMissing(err)
        ? resolve(Either.right<AppError, T>(content))
        : resolve(Either.left<AppError, T>(appErrorFactory(err)));
    };
