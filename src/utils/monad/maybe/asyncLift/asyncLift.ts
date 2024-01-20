import { Maybe } from 'tsmonad';
import { Injector } from '../maybe.types';
import extractPromise from '../patterns/extractPromise/extractPromise';

export default <I, O> (f: (val: I) => Promise<O>): Injector<I, O> =>
  (maybeValue: Maybe<I>): Promise<Maybe<O>> =>
    maybeValue
      .lift(f)
      .caseOf(extractPromise());
