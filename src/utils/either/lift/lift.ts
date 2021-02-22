import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { Lifter } from '../either.types';

export default <I, O> (f: (val: I) => O): Lifter<I, O> =>
  (valueOrError: Either<AppError, I>): Either<AppError, O> =>
    valueOrError.lift(f);
