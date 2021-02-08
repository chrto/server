import { User } from 'model/sequelize/model/user/user';
import { NotFound } from 'common/httpErrors';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { TransactionContext } from 'model/sequelize/modelFactory/modelFactory.types';
import { SequelizeIncludes } from 'service/sequelize/types';
import { SequelizeStorage } from 'storage/sequelize/factory/sequelizeStorage.types';

export default ({ findOne }: SequelizeStorage<User>) =>
  (includes: SequelizeIncludes) =>
    (context?: TransactionContext) =>
      async (email: string): Promise<Either<AppError, User>> =>
        findOne(
          { where: { email: email }, ...includes, ...context },
          new NotFound(`Cannot find user identified by email address '${email}'`)
        );
