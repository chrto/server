import { Maybe, OptionalMaybePatterns } from 'tsmonad';
import { isMissing } from 'utils/validation';
import { AsyncDoer } from '../maybe.types';

export default <T> (pattern: OptionalMaybePatterns<T, Promise<void>>): AsyncDoer<T> =>
  (maybeValue: Maybe<T>): Promise<Maybe<T>> =>
    maybeValue
      .caseOf({
        just: !isMissing(pattern.just) ? pattern.just : (_v) => Promise.resolve(null),
        nothing: !isMissing(pattern.nothing) ? pattern.nothing : () => Promise.resolve(null)
      })
      .then(() => maybeValue);
