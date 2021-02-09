import { valueOrError } from 'utils/either';
import { AppError } from 'common/error';
import { FindOptions, Model } from 'sequelize/types';
import { Either } from 'tsmonad';
import { Fcn } from 'common/types';

export default (errorHandler: Fcn<[Error, string], AppError>) =>
  <T extends Model> (model: { new(): T; } & typeof Model) =>
    async (options: FindOptions, error: AppError): Promise<Either<AppError, T>> =>
      model.findOne<T>(options)
        .then(valueOrError(error))
        .catch((error: Error): Either<AppError, T> => Either.left<AppError, T>(errorHandler(error, `while looking for ${model.name}`)));
