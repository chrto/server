import { AppError } from 'common/error';
import { FindAndCountOptions, Model } from 'sequelize/types';
import { Either } from 'tsmonad';
import { RowsAndCount } from '../sequelizeStorage.types';
import { Fcn } from 'common/types';

export default (errorHandler: Fcn<[Error, string], AppError>) =>
  <T extends Model> (model: { new(): T; } & typeof Model) =>
    async (options: FindAndCountOptions): Promise<Either<AppError, RowsAndCount<T>>> =>
      model.findAndCountAll<T>(options)
        .then(Either.right)
        .catch((error: Error): Either<AppError, RowsAndCount<T>> => Either.left<AppError, RowsAndCount<T>>(errorHandler(error, `while looking for ${model.name}:`)));
