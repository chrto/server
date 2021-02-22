import { AppError } from 'common/error';
import { Either, EitherPatterns } from 'tsmonad';
import { Unwrapper } from '../either.types';

export default <R, T> (pattern: EitherPatterns<AppError, R, T>): Unwrapper<R, T> =>
  (valueOrError: Either<AppError, R>): T =>
    valueOrError.caseOf(pattern);
