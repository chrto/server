import { Maybe } from 'tsmonad';
import { Predicate } from 'common/types';

export default <T> (predicate: Predicate<T>) =>
  (val: T): Maybe<T> =>
    predicate(val) ?
      Maybe.just(val) :
      Maybe.nothing();
