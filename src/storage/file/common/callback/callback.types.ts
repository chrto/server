import { AppError } from 'common/error';
import { Factory } from 'common/types';
import { FSError } from 'storage/file/file.types';
import { Either } from 'tsmonad';

export type FSCallback<T> = (err: FSError, content?: T) => void;
export type FSPromiseResolve<T> = (v: Either<AppError, T>) => void;
export type FSCallbackFactory<T> = Factory<FSPromiseResolve<T>, FSCallback<T>>;
