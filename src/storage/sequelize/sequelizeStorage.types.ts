import { AppError } from 'common/error';
import { CreateOptions, DestroyOptions, FindAndCountOptions, FindOptions, Model, UpdateOptions } from 'sequelize';
import { Either } from 'tsmonad';

export interface RowsAndCount<T> {
  rows: T[];
  count: number;
}

export interface SequelizeStorage {
  findAll: <T extends Model> (model: { new(): T; } & typeof Model, options: FindOptions) => Promise<Either<AppError, T[]>>;
  findOne: <T extends Model>(model: { new(): T; } & typeof Model, options: FindOptions, error: AppError) => Promise<Either<AppError, T>>;
  findAndCountAll: <T extends Model>(model: { new(): T; } & typeof Model, options: FindAndCountOptions) => Promise<Either<AppError, RowsAndCount<T>>>;
  findByPk: <T extends Model>(model: { new(): T; } & typeof Model, id: number | string, options: FindOptions, error: AppError) => Promise<Either<AppError, T>>;
  update: <T extends Model>(model: { new(): T; } & typeof Model, values: object, options: UpdateOptions, error: AppError) => Promise<Either<AppError, T>>;
  updateAll: <T extends Model>(model: { new(): T; } & typeof Model, object: any, options: UpdateOptions, error: AppError) => Promise<Either<AppError, number>>;
  create: <T extends Model>(model: { new(): T; } & typeof Model, values: object, options?: CreateOptions) => Promise<Either<AppError, T>>;
  bulkCreate: <T extends Model>(model: { new(): T; } & typeof Model, records: object[], options?: CreateOptions) => Promise<Either<AppError, T[]>>;
  destroy: <T extends Model>(model: { new(): T; } & typeof Model, options?: DestroyOptions) => Promise<Either<AppError, number>>;
}
