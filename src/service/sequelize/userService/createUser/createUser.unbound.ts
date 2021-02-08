import { AppError } from 'common/error';
import { User } from 'model/sequelize/model/user/user';
import { Either } from 'tsmonad';
import { UserRequired } from 'model/sequelize/model/user/user.types';
import { TransactionContext } from 'model/sequelize/modelFactory/modelFactory.types';
import { SequelizeStorage } from 'storage/sequelize/factory/sequelizeStorage.types';

export default ({ create }: SequelizeStorage<User>) =>
  (context?: TransactionContext) =>
    async (userReq: UserRequired): Promise<Either<AppError, User>> =>
      create(userReq, context);
