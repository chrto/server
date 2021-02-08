import errorHandler from '../errorHandler';
import { AppError } from 'common/error';
import { Model, UpdateOptions } from 'sequelize/types';
import { Either } from 'tsmonad';

export default <T extends Model> (model: { new(): T; } & typeof Model) =>
  async (object: any, options: UpdateOptions): Promise<Either<AppError, number>> =>
    model.update<T>(object, options)
      .then(([numRowsChanged]: [number]): number => numRowsChanged)
      .catch((error: Error): Either<AppError, number> => Either.left<AppError, number>(errorHandler(error, `while trying to update ${model.name}:`)));
