import { AppError } from 'common/error';
import { Either } from 'tsmonad';

export default <T> (e: AppError) =>
  (v: T): Either<AppError, T> =>
    v !== undefined && v !== null ? Either.right(v) : Either.left(e);
