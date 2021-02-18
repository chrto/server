import { AppError } from 'common/error';
import { Either } from 'tsmonad';

export type Doer<T> = (input: Either<AppError, T>) => Either<AppError, T>;
