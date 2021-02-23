import { AppError } from 'common/error';
import { Either, EitherPatterns } from 'tsmonad';
import { Unwrapper } from '../either.types';

export default <R, T> (pattern: EitherPatterns<AppError, R, Promise<T>>): Unwrapper<R, Promise<T>> =>
  (valueOrError: Either<AppError, R>): Promise<T> =>
    valueOrError.caseOf(pattern);
