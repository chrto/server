import { AppError } from 'common/error';
import { Either } from 'tsmonad';

export type Doer<T> = (input: Either<AppError, T>) => Either<AppError, T>;
export type Unwrapper<I, O> = (input: Either<AppError, I>) => O;
