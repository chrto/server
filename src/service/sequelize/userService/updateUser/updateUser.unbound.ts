import { User } from 'model/sequelize/user/user';
import { Either } from 'tsmonad';
import { NotFound } from 'common/httpErrors';
import { AppError } from 'common/error';
import { TransactionContext } from 'model/sequelize/modelFactory/modelFactory.types';
import { SequelizeIncludes } from 'service/sequelize/types';
import { SequelizeStorage } from 'storage/sequelize/sequelizeStorage.types';
import { UserItems } from 'model/sequelize/user/user.types';
import { OptionalExceptFor } from 'common/types';

export default ({ update }: SequelizeStorage) =>
  (includes: SequelizeIncludes) =>
    (context?: TransactionContext) =>
      async (user: OptionalExceptFor<UserItems, 'id'>): Promise<Either<AppError, User>> =>
        update<User>(
          User,
          user,
          { where: { id: user.id }, ...includes, ...context },
          new NotFound(`Cannot find user identified by id = '${user.id}'`)
        );
