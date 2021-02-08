import errorHandler from '../errorHandler';
import { AppError } from 'common/error';
import { CreateOptions, Model } from 'sequelize/types';
import { Either } from 'tsmonad';

export default <T extends Model> (model: { new(): T; } & typeof Model) =>
  async (values: object, options?: CreateOptions): Promise<Either<AppError, T>> =>
    model.create<T>(values, options)
      .then(Either.right)
      .catch((error: Error): Either<AppError, T> => Either.left<AppError, T>(errorHandler(error, `while trying to create ${model.name}:`)));
