import { Maybe } from 'tsmonad';
import { Lifter } from '../maybe.types';

export default <I, O> (f: (val: I) => O): Lifter<I, O> =>
  (maybeValue: Maybe<I>): Maybe<O> =>
    maybeValue.lift(f);
