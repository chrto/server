import errorHandler from '../errorHandler';
import { AppError } from 'common/error';
import { FindOptions, Model } from 'sequelize/types';
import { Either } from 'tsmonad';

export default <T extends Model> (model: { new(): T; } & typeof Model) =>
  async (options: FindOptions): Promise<Either<AppError, T[]>> =>
    model.findAll<T>(options)
      .then(Either.right)
      .catch((error: Error): Either<AppError, T[]> => Either.left<AppError, T[]>(errorHandler(error, `while looking for ${model.name}:`)));
