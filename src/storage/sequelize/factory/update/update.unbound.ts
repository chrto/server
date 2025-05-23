import { AppError } from 'common/error';
import { Attributes, Model, ModelStatic, UpdateOptions } from 'sequelize';
import { Col, Fn, Literal } from 'sequelize/types/utils';
import { Either } from 'tsmonad';
import { Fcn } from 'common/types';

export default (errorHandler: Fcn<[Error, string], AppError>) =>
  <T extends Model> (model: ModelStatic<T>) =>
    async (values: { [key in keyof Attributes<T>]?: Attributes<T>[key] | Fn | Col | Literal; }, options: UpdateOptions): Promise<Either<AppError, number>> =>
      model.update<T>(values, options)
        .then(([numRowsChanged]: [number]): Either<AppError, number> => Either.right(numRowsChanged))
        .catch((error: Error): Either<AppError, number> => Either.left<AppError, number>(errorHandler(error, `while trying to update ${model.name}`)));
