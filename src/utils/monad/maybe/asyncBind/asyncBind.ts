import extractPromiseMaybe from '../patterns/extractPromiseMaybe/extractPromiseMaybe';
import { Maybe } from 'tsmonad';

type Injector<I, O> = (input: Maybe<I>) => Promise<Maybe<O>>;

export default <I, O> (f: (val: I) => Promise<Maybe<O>>): Injector<I, O> =>
  (maybeValue: Maybe<I>): Promise<Maybe<O>> =>
    maybeValue
      .lift(f)
      .caseOf(extractPromiseMaybe<O>());
