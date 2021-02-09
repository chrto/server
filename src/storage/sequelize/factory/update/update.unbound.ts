import { AppError } from 'common/error';
import { Model, UpdateOptions } from 'sequelize/types';
import { Either } from 'tsmonad';
import { Fcn } from 'common/types';

export default (errorHandler: Fcn<[Error, string], AppError>) =>
  <T extends Model> (model: { new(): T; } & typeof Model) =>
    async (object: any, options: UpdateOptions): Promise<Either<AppError, number>> =>
      model.update<T>(object, options)
        .then(([numRowsChanged]: [number]): number => numRowsChanged)
        .catch((error: Error): Either<AppError, number> => Either.left<AppError, number>(errorHandler(error, `while trying to update ${model.name}`)));
