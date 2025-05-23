import { AppError } from 'common/error';
import { Either } from 'tsmonad';

export default <T> (d: T) =>
  (v: T): Either<AppError, T> =>
    v !== undefined && v !== null ? Either.right(v) : Either.right(d);
