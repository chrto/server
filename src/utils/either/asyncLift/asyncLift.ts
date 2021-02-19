import { AppError } from 'common/error';
import { InvalidInput } from 'common/httpErrors';
import { Either, EitherPatterns } from 'tsmonad';
import { valueOrError } from 'utils/either';
import { Injector } from '../either.types';

/**
 * For a right value extracts the promise from Either<Error, Promise<T>> and returns it with Either or
 * returns a new promise with the resolved error for a left value.
 */
const extractPromise = <T> (): EitherPatterns<AppError, Promise<T>, Promise<Either<AppError, T>>> => ({
  right: (valPromise: Promise<T>): Promise<Either<AppError, T>> =>
    valPromise.then(valueOrError(new InvalidInput(`Got null value`))),
  left: (error: AppError): Promise<Either<AppError, T>> => Promise.resolve(Either.left<AppError, T>(error))
});

export default <I, O> (f: (val: I) => Promise<O>): Injector<I, O> =>
  (valueOrError: Either<AppError, I>): Promise<Either<AppError, O>> =>
    valueOrError
      .lift(f)
      .caseOf(extractPromise());
