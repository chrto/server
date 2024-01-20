import { Maybe, OptionalMaybePatterns } from 'tsmonad';
import { Doer } from '../maybe.types';

export default <T> (pattern: OptionalMaybePatterns<T, void>): Doer<T> =>
  (valueOrError: Maybe<T>): Maybe<T> =>
    valueOrError.do(pattern);
