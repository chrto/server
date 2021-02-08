import { User } from 'model/sequelize/model/user/user';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { TransactionContext } from 'model/sequelize/modelFactory/modelFactory.types';
import { SequelizeStorage } from 'storage/sequelize/factory/sequelizeStorage.types';

export default ({ destroy }: SequelizeStorage<User>) =>
  (context?: TransactionContext) =>
    async (user: User): Promise<Either<AppError, number>> =>
      destroy({ where: { id: user.id }, ...context });
