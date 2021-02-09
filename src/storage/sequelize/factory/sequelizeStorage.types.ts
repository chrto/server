import { AppError } from 'common/error';
import { Entity } from 'model/sequelize/modelFactory/modelFactory.types';
import { CreateOptions, DestroyOptions, FindAndCountOptions, FindOptions, Model, UpdateOptions } from 'sequelize';
import { SequelizeIncludes } from 'service/sequelize/types';
import { Either } from 'tsmonad';

export interface RowsAndCount<T> {
  rows: T[];
  count: number;
}

export interface SequelizeStorage<T extends Model> {
  findAll: (options: FindOptions) => Promise<Either<AppError, T[]>>;
  findOne: (options: FindOptions, error: AppError) => Promise<Either<AppError, T>>;
  findAndCountAll: (options: FindAndCountOptions) => Promise<Either<AppError, RowsAndCount<T>>>;
  findByPk: (id: string, options: FindOptions, error: AppError) => Promise<Either<AppError, T>>;
  update: (values: object, options: UpdateOptions, error: AppError) => Promise<Either<AppError, number>>;
  updateByPk: (object: Entity<string>, options: UpdateOptions, includes: SequelizeIncludes, error: AppError) => Promise<Either<AppError, T>>;
  create: (values: object, options?: CreateOptions) => Promise<Either<AppError, T>>;
  bulkCreate: (records: object[], options?: CreateOptions) => Promise<Either<AppError, T[]>>;
  destroy: (options?: DestroyOptions) => Promise<Either<AppError, number>>;
}
