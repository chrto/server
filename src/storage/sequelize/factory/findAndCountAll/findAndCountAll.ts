import errorHandler from '../errorHandler';
import { AppError } from 'common/error';
import { FindAndCountOptions, Model } from 'sequelize/types';
import { Either } from 'tsmonad';
import { RowsAndCount } from '../sequelizeStorage.types';

export default <T extends Model> (model: { new(): T; } & typeof Model) =>
  async (options: FindAndCountOptions): Promise<Either<AppError, RowsAndCount<T>>> =>
    model.findAndCountAll<T>(options)
      .then(Either.right)
      .catch((error: Error): Either<AppError, RowsAndCount<T>> => Either.left<AppError, RowsAndCount<T>>(errorHandler(error, `while looking for ${model.name}:`)));
