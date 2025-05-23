import { AppError } from 'common/error';
import { DestroyOptions, Model, ModelStatic } from 'sequelize/types';
import { Either } from 'tsmonad';
import { Fcn } from 'common/types';

export default (errorHandler: Fcn<[Error, string], AppError>) =>
  <T extends Model> (model: ModelStatic<T>) =>
    async (options?: DestroyOptions): Promise<Either<AppError, number>> =>
      model.destroy(options)
        .then(Either.right)
        .catch((error: Error): Either<AppError, number> => Either.left<AppError, number>(errorHandler(error, `while trying to delete ${model.name}:`)));
