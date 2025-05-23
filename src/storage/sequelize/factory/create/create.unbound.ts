import { AppError } from 'common/error';
import { CreateOptions, CreationAttributes, Model, ModelStatic } from 'sequelize/types';
import { Either } from 'tsmonad';
import { Fcn } from 'common/types';

export default (errorHandler: Fcn<[Error, string], AppError>) =>
  <T extends Model> (model: ModelStatic<T>) =>
    async (record: CreationAttributes<T>, options?: CreateOptions): Promise<Either<AppError, T>> =>
      model.create<T>(record, options)
        .then(Either.right)
        .catch((error: Error): Either<AppError, T> => Either.left<AppError, T>(errorHandler(error, `while trying to create ${model.name}:`)));
