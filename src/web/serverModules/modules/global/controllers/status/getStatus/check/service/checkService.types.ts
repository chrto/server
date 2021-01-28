import { AppError } from 'common/error';
import { Either } from 'tsmonad';

export interface ServicePing<T = any> {
  ping: () => Promise<Either<AppError, T>>;
}
