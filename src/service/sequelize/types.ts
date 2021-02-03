import { AppError } from 'common/error';
import { TransactionContext } from 'model/sequelize/modelFactory/modelFactory.types';
import { Includeable } from 'sequelize/types';
import { Either } from 'tsmonad';

export type SequelizeService<I extends any[], O> = (context?: TransactionContext) => (...args: I) => Promise<Either<AppError, O>>;

export interface SequelizeIncludes {
  include: Includeable[];
}
