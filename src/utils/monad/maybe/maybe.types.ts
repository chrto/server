import { Maybe } from 'tsmonad';

export type Injector<I, O> = (input: Maybe<I>) => Promise<Maybe<O>>;
export type Binder<I, O> = (input: Maybe<I>) => Maybe<O>;
export type Lifter<I, O> = (input: Maybe<I>) => Maybe<O>;
export type AsyncDoer<T> = (input: Maybe<T>) => Promise<Maybe<T>>;
export type Unwrapper<I, O> = (input: Maybe<I>) => O;
export type Doer<T> = (input: Maybe<T>) => Maybe<T>;
