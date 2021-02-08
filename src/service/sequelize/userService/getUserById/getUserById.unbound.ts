import { AppError } from 'common/error';
import { NotFound } from 'common/httpErrors';
import { TransactionContext } from 'model/sequelize/modelFactory/modelFactory.types';
import { User } from 'model/sequelize/model/user/user';
import { SequelizeIncludes } from 'service/sequelize/types';
import { Either } from 'tsmonad';
import { SequelizeStorage } from 'storage/sequelize/factory/sequelizeStorage.types';

export default ({ findByPk }: SequelizeStorage<User>) =>
  (includes: SequelizeIncludes) =>
    (context?: TransactionContext) =>
      async (id: string): Promise<Either<AppError, User>> =>
        findByPk(
          id,
          { ...includes, ...context },
          new NotFound(`Cannot find user identified by id = '${id}'`)
        );
