import { AppError } from 'common/error';
import { EitherPatterns } from 'tsmonad';

/**
 * Only use for Eithers where there is no possible Left value,
 * because it returns null for a Left value (so that it type-checks)
 */
export default <T> (): EitherPatterns<AppError, T, T> => ({
  right: v => v,
  left: () => null
});
