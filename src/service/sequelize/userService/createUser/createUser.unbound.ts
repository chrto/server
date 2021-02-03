import { AppError } from 'common/error';
import { User } from 'model/sequelize/user/user';
import { Either } from 'tsmonad';
import { UserRequired } from 'model/sequelize/user/user.types';
import { TransactionContext } from 'model/sequelize/modelFactory/modelFactory.types';
import { SequelizeStorage } from 'storage/sequelize/sequelizeStorage.types';

export default ({ create }: SequelizeStorage) =>
  () =>
    (context?: TransactionContext) =>
      async (userReq: UserRequired): Promise<Either<AppError, User>> =>
        create<User>(User, userReq, context);
