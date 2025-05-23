import { Maybe } from 'tsmonad';
import { Binder } from '../maybe.types';

export default <I, O> (f: (val: I) => Maybe<O>): Binder<I, O> =>
  (maybeValue: Maybe<I>): Maybe<O> =>
    maybeValue.bind(f);
