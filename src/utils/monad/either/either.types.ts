import { AppError } from 'common/error';
import { Either } from 'tsmonad';

export type Injector<I, O> = (input: Either<AppError, I>) => Promise<Either<AppError, O>>;
export type Binder<I, O> = (input: Either<AppError, I>) => Either<AppError, O>;
export type Lifter<I, O> = (input: Either<AppError, I>) => Either<AppError, O>;
export type Doer<T> = (input: Either<AppError, T>) => Either<AppError, T>;
export type AsyncDoer<T> = (input: Either<AppError, T>) => Promise<Either<AppError, T>>;
export type Unwrapper<I, O> = (input: Either<AppError, I>) => O;
