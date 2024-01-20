import { Maybe } from 'tsmonad';

export default <T> (v: T): Maybe<T> =>
  v !== undefined && v !== null ? Maybe.just(v) : Maybe.nothing();
