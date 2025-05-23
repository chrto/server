import { AppError } from 'common/error';
import { FindOptions, Model, ModelStatic } from 'sequelize/types';
import { Either } from 'tsmonad';
import { Fcn } from 'common/types';

export default (errorHandler: Fcn<[Error, string], AppError>) =>
  <T extends Model> (model: ModelStatic<T>) =>
    async (options: FindOptions): Promise<Either<AppError, T[]>> =>
      model.findAll<T>(options)
        .then(Either.right)
        .catch((error: Error): Either<AppError, T[]> => Either.left<AppError, T[]>(errorHandler(error, `while looking for ${model.name}:`)));
