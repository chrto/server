import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { Predicate } from 'common/types';

export default <T> (predicate: Predicate<T>, error: AppError) =>
  (val: T): Either<AppError, T> =>
    predicate(val) ?
      Either.right(val) :
      Either.left(error);
