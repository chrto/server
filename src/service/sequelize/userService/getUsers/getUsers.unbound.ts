import { User } from 'model/sequelize/user/user';
import { Order, WhereOptions } from 'sequelize';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { TransactionContext } from 'model/sequelize/modelFactory/modelFactory.types';
import { SequelizeIncludes } from 'service/sequelize/types';
import { SequelizeStorage } from 'storage/sequelize/sequelizeStorage.types';

export default ({ findAll }: SequelizeStorage) =>
  (includes: SequelizeIncludes) =>
    (context?: TransactionContext) =>
      async (where?: WhereOptions, order?: Order): Promise<Either<AppError, User[]>> =>
        findAll<User>(User, { where, order, ...includes, ...context });
