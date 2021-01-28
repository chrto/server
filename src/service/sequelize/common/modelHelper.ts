import { map } from 'ramda';
import {
  CreateOptions,
  DestroyOptions,
  ExclusionConstraintError,
  FindAndCountOptions,
  FindOptions,
  ForeignKeyConstraintError,
  Model,
  SequelizeScopeError,
  UniqueConstraintError,
  UpdateOptions,
  ValidationError
} from 'sequelize';
import { Either, either } from 'tsmonad';
import { valueOrError } from 'utils/either';
import logger from 'utils/logger';
import { Conflict } from 'common/httpErrors';
import { AppError } from 'common/error';

interface RowsAndCount<T> {
  rows: T[];
  count: number;
}

/** Turn a Sequelize entity into a plain JS object */
export const sanitizeEntity = <T>(entity: Model<T>): any => entity ? entity.get({ plain: true }) : null;

/** Turn an array of Sequelize entities into an array of plain JS objects */
export const sanitizeEntities = <T>(entities: Model<T>[]): any[] => map(sanitizeEntity, entities);

const getErrorMessage = (error: Error): string =>
  [
    (error as any).message ? 'message: ' + (error as any).message : '',
    (error as any).errors ? (error as any).errors.map((error: Error) => error.message) : ''
  ]
    .filter((item) => item !== '')
    .join('\n');

const createErrorLogMessage = (error: Error, msg?: string): string =>
  [
    !!msg ? msg : '',
    (error as any).name ? 'name: ' + (error as any).name : '',
    getErrorMessage(error),
    (error as any).sql ? 'sql: ' + (error as any).sql : '',
    (error as any).stack ? 'stack: ' + (error as any).stack : ''
  ]
    .filter((item) => item !== '')
    .join('\n');

const errorHandler = (error: Error, message?: string): AppError => {
  logger.error(createErrorLogMessage(error, message));

  if (
    error instanceof ExclusionConstraintError ||
    error instanceof ForeignKeyConstraintError ||
    error instanceof UniqueConstraintError ||
    error instanceof ValidationError ||
    error instanceof SequelizeScopeError
  ) {
    return new Conflict(getErrorMessage(error));
  } else {
    return new AppError('500', 'Internal Server Error');
  }
};

export const getAllowedFields = <T>(model: T & typeof Model, extAttr: string[] = []): string[] =>
  Object
    .keys(model.rawAttributes)
    .filter(attr => !attr.includes('_'))
    .concat(
      Object
        .keys(model.associations)
        .filter((attr => model.associations[attr].isMultiAssociation && model.associations[attr].isAliased))
    )
    .concat(extAttr);

export async function findAll<T extends Model>(model: { new(): T } & typeof Model, options: FindOptions): Promise<Either<AppError, T[]>> {
  return Promise.resolve(
    model.findAll<T>(options)
      .then((rows: T[]): Either<AppError, T[]> => either(null, rows))
      .catch((error: Error): Either<AppError, T[]> => either(errorHandler(error, `while looking for ${model.name}:`), null))
  );
}

export async function findOne<T extends Model>(model: { new(): T } & typeof Model, options: FindOptions, error: AppError): Promise<Either<AppError, T>> {
  return Promise.resolve(
    model.findOne<T>(options)
      .then(valueOrError(error))
      .catch((error: Error): Either<AppError, T> => either(errorHandler(error, `while looking for ${model.name}:`), null))
  );
}

export async function findAndCountAll<T extends Model>(model: { new(): T } & typeof Model, options: FindAndCountOptions): Promise<Either<AppError, RowsAndCount<T>>> {
  return Promise.resolve(
    model.findAndCountAll<T>(options)
      .then((result: RowsAndCount<T>): Either<AppError, RowsAndCount<T>> => either(null, result))
      .catch((error: Error): Either<AppError, RowsAndCount<T>> => either(errorHandler(error, `while looking for ${model.name}:`), null))
  );
}

export async function findByPk<T extends Model>(model: { new(): T } & typeof Model, id: number | string, options: FindOptions, error: AppError): Promise<Either<AppError, T>> {
  return Promise.resolve(
    model.findByPk<T>(id, options)
      .then(valueOrError(error))
      .catch((error: Error): Either<AppError, T> => either(errorHandler(error, `while looking for ${model.name} with id '${id}':`), null))
  );
}

export async function update<T extends Model>(model: { new(): T } & typeof Model, values: object, options: UpdateOptions, error: AppError): Promise<Either<AppError, T>> {
  const findAllOptions: UpdateOptions = {
    ...['transaction', 'incude'].reduce((acc: object, key: string): object => options[key] ? (acc[key] = options[key], acc) : acc, {}),
    where: options.where
  };
  return Promise.resolve(
    model.update<T>(values, options)
      .then(
        async ([numRowsChanged]): Promise<[number, T[]]> =>
          ([numRowsChanged, await model.findAll<T>(findAllOptions)])
      )
      .then(
        ([numRowsChanged, objects]) =>
          numRowsChanged === 1
            ? objects[0]
            : null
      )
      .then(valueOrError(error))
      .catch((error: Error): Either<AppError, T> => either(errorHandler(error, `while trying to update ${model.name}:`), null))
  );
}

export async function updateAll<T extends Model>(model: { new(): T } & typeof Model, object: any, options: UpdateOptions, error: AppError): Promise<Either<AppError, number>> {
  return Promise.resolve(
    model.update<T>(object, options)
      .then(
        ([numRowsChanged, _objects]) =>
          numRowsChanged > 0
            ? numRowsChanged
            : null
      )
      .then(valueOrError(error))
      .catch((error: Error): Either<AppError, number> => either(errorHandler(error, `while trying to update ${model.name}:`), null))
  );
}

export async function create<T extends Model>(model: { new(): T } & typeof Model, values: object, options?: CreateOptions): Promise<Either<AppError, T>> {
  return Promise.resolve(
    model.create<T>(values, options)
      .then((newRow: T): Either<AppError, T> => either(null, newRow))
      .catch((error: Error): Either<AppError, T> => either(errorHandler(error, `while trying to create ${model.name}:`), null))
  );
}

export async function bulkCreate<T extends Model>(model: { new(): T } & typeof Model, records: object[], options?: CreateOptions): Promise<Either<AppError, T[]>> {
  return Promise.resolve(
    model.bulkCreate<T>(records, options)
      .then((newRows: T[]): Either<AppError, T[]> => either(null, newRows))
      .catch((error: Error): Either<AppError, T[]> => either(errorHandler(error, `while trying to create ${model.name}:`), null))
  );
}

export async function destroy<T extends Model>(model: { new(): T } & typeof Model, options?: DestroyOptions): Promise<Either<AppError, number>> {
  return Promise.resolve(
    model.destroy(options)
      .then((numRows: number): Either<AppError, number> => either(null, numRows))
      .catch((error: Error): Either<AppError, number> => either(errorHandler(error, `while trying to delete ${model.name}:`), null))
  );
}
