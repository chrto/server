import valueOrError from 'utils/monad/either/patterns/valueOrError/valueOrError';
import { AppError } from 'common/error';
import { Model, UpdateOptions } from 'sequelize/types';
import { Either } from 'tsmonad';
import { SequelizeIncludes } from 'service/sequelize/types';
import { Entity } from 'model/sequelize/modelFactory/modelFactory.types';
import { RowsAndCount } from '../sequelizeStorage.types';
import { Fcn } from 'common/types';

export default (errorHandler: Fcn<[Error, string], AppError>) =>
  <T extends Model> (model: { new(): T; } & typeof Model) =>
    async (values: Entity<string>, options: Omit<UpdateOptions, 'where'>, includes: SequelizeIncludes, error: AppError): Promise<Either<AppError, T>> =>
      model.update<T>(values, { where: { id: values.id }, ...options })
        .then(
          async ([numRowsChanged]: [number]): Promise<RowsAndCount<T>> =>
            numRowsChanged === 0
              ? Promise.resolve({ rows: [], count: 0 })
              : model.findAndCountAll({ where: { id: values.id }, ...options, ...includes })
        )
        .then((rowsAndCount: RowsAndCount<T>): T => rowsAndCount.count === 0 ? null : rowsAndCount.rows[0])
        .then(valueOrError(error))
        .catch((error: Error): Either<AppError, T> => Either.left<AppError, T>(errorHandler(error, `while trying to update ${model.name}`)));
