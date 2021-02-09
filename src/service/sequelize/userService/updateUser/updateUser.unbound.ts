import { User } from 'model/sequelize/model/user/user';
import { Either } from 'tsmonad';
import { NotFound } from 'common/httpErrors';
import { AppError } from 'common/error';
import { TransactionContext } from 'model/sequelize/modelFactory/modelFactory.types';
import { SequelizeIncludes } from 'service/sequelize/types';
import { UserItems } from 'model/sequelize/model/user/user.types';
import { OptionalExceptFor } from 'common/types';
import { SequelizeStorage } from 'storage/sequelize/factory/sequelizeStorage.types';

export default ({ updateByPk }: SequelizeStorage<User>) =>
  (includes: SequelizeIncludes) =>
    (context?: TransactionContext) =>
      async (user: OptionalExceptFor<UserItems, 'id'>): Promise<Either<AppError, User>> =>
        updateByPk(
          user,
          { where: { id: user.id }, ...context },
          includes,
          new NotFound(`Cannot find user identified by id = '${user.id}'`)
        );
