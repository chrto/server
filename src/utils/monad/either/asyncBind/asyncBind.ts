import { AppError } from 'common/error';
import { Either, EitherPatterns } from 'tsmonad';
import { Injector } from '../either.types';

/**
 * For a right value extracts the promise from Either<Error, Promise<Either<Error, T>>> and returns it or
 * returns a new promise with the resolved error for a left value.
 */
const extractPromise = <T> (): EitherPatterns<AppError, Promise<Either<AppError, T>>, Promise<Either<AppError, T>>> => ({
  right: (promise: Promise<Either<AppError, T>>): Promise<Either<AppError, T>> => promise,
  left: (error: AppError): Promise<Either<AppError, T>> => Promise.resolve(Either.left<AppError, T>(error))
});

export default <I, O> (f: (val: I) => Promise<Either<AppError, O>>): Injector<I, O> =>
  (valueOrError: Either<AppError, I>): Promise<Either<AppError, O>> =>
    valueOrError
      .lift(f)
      .caseOf(extractPromise<O>());
