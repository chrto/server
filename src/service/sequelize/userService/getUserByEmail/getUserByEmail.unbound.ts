import { User } from 'model/sequelize/user/user';
import { NotFound } from 'common/httpErrors';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { TransactionContext } from 'model/sequelize/modelFactory/modelFactory.types';
import { SequelizeIncludes } from 'service/sequelize/types';
import { SequelizeStorage } from 'storage/sequelize/sequelizeStorage.types';

export default ({ findOne }: SequelizeStorage) =>
  (includes: SequelizeIncludes) =>
    (context?: TransactionContext) =>
      async (email: string): Promise<Either<AppError, User>> =>
        findOne<User>(
          User,
          { where: { email: email }, ...includes, ...context },
          new NotFound(`Cannot find user identified by email address '${email}'`)
        );
