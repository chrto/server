import { Maybe, MaybePatterns } from 'tsmonad';

export default <T> (): MaybePatterns<Promise<Maybe<T>>, Promise<Maybe<T>>> => ({
  just: (promise: Promise<Maybe<T>>): Promise<Maybe<T>> => promise,
  nothing: (): Promise<Maybe<T>> => Promise.resolve(Maybe.nothing<T>())
});
