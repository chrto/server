import { AppError } from 'common/error';
import { Either } from 'tsmonad';

export default <T> (f: (val: T) => Either<AppError, void>) =>
  (valueOrError: Either<AppError, T>): Either<AppError, T> =>
    valueOrError
      .bind(f)
      .caseOf({
        right: (): Either<AppError, T> => valueOrError,
        left: (error: AppError): Either<AppError, T> => Either.left(error)
      });
