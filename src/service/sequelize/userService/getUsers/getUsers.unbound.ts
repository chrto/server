import { User } from 'model/sequelize/model/user/user';
import { Order, WhereOptions } from 'sequelize';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { TransactionContext } from 'model/sequelize/modelFactory/modelFactory.types';
import { SequelizeIncludes } from 'service/sequelize/types';
import { SequelizeStorage } from 'storage/sequelize/factory/sequelizeStorage.types';

export default ({ findAll }: SequelizeStorage<User>) =>
  (includes: SequelizeIncludes) =>
    (context?: TransactionContext) =>
      async (where?: WhereOptions, order?: Order): Promise<Either<AppError, User[]>> =>
        findAll({ where, order, ...includes, ...context });
