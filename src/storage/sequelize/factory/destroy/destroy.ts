import errorHandler from '../errorHandler';
import { AppError } from 'common/error';
import { DestroyOptions, Model } from 'sequelize/types';
import { Either } from 'tsmonad';

export default <T extends Model> (model: { new(): T; } & typeof Model) =>
  async (options?: DestroyOptions): Promise<Either<AppError, number>> =>
    model.destroy(options)
      .then(Either.right)
      .catch((error: Error): Either<AppError, number> => Either.left<AppError, number>(errorHandler(error, `while trying to delete ${model.name}:`)));
