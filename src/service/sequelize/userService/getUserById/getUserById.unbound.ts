import { AppError } from 'common/error';
import { NotFound } from 'common/httpErrors';
import { TransactionContext } from 'model/sequelize/modelFactory/modelFactory.types';
import { User } from 'model/sequelize/user/user';
import { SequelizeIncludes } from 'service/sequelize/types';
import { Either } from 'tsmonad';

export default (includes: SequelizeIncludes) =>
  (context?: TransactionContext) =>
    async (id: string): Promise<Either<AppError, User>> =>
      findByPk<User>(
        User,
        id,
        { ...includes, ...context },
        new NotFound(`Cannot find user identified by id = '${id}'`)
      );
