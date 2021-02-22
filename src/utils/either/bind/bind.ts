import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { Binder } from '../either.types';

export default <I, O> (f: (val: I) => Either<AppError, O>): Binder<I, O> =>
  (valueOrError: Either<AppError, I>): Either<AppError, O> =>
    valueOrError.bind(f);
