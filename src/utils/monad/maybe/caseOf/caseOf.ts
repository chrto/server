import { Maybe, MaybePatterns } from 'tsmonad';
import { Unwrapper } from '../maybe.types';

export default <T, U> (pattern: MaybePatterns<T, U>): Unwrapper<T, U> =>
  (maybeValue: Maybe<T>): U =>
    maybeValue.caseOf(pattern);
