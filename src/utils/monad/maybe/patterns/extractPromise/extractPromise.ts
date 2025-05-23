import maybeValue from '../maybeValue/maybeValue';
import { Maybe, MaybePatterns } from 'tsmonad';

/**
 * For a just value extracts the promise from Maybe<Promise<T>> and returns it with Maybe or
 * returns a new promise with the resolved Nothing.
 */
export default <T> (): MaybePatterns<Promise<T>, Promise<Maybe<T>>> => ({
  just: (valPromise: Promise<T>): Promise<Maybe<T>> =>
    valPromise.then(maybeValue),
  nothing: (): Promise<Maybe<T>> => Promise.resolve(Maybe.nothing<T>())
});
