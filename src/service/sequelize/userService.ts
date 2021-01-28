import { Order, WhereOptions } from 'sequelize/types';
import { Either } from 'tsmonad';
import { NotFound } from 'common/httpErrors';
import { User } from 'model/sequelize/user/user';
import { AppError } from 'common/error';
import { UserRequired } from 'model/sequelize/user/user.types';
import { TransactionContext } from 'model/sequelize/modelFactory/modelFactory.types';

import { create, destroy, findAll, findByPk, findOne, sanitizeEntity, update } from './common/modelHelper';

export interface UserService {
  getUserById: (context?: TransactionContext) => (id: string) => Promise<Either<AppError, User>>;
  getUserByEmail: (context?: TransactionContext) => (email: string) => Promise<Either<AppError, User>>;
  getUsers: (context?: TransactionContext) => (where?: WhereOptions, order?: Order) => Promise<Either<AppError, User[]>>;
  createUser: (context?: TransactionContext) => (userReq: UserRequired) => Promise<Either<AppError, User>>;
  updateUser: (context?: TransactionContext) => (user: User) => Promise<Either<AppError, User>>;
  deleteUser: (context?: TransactionContext) => (user: User) => Promise<Either<AppError, number>>;
}

export default () => {
  const includes = {
    include: []
  };

  return {
    getUserById: (context?: TransactionContext) =>
      async (id: string): Promise<Either<AppError, User>> =>
        findByPk<User>(
          User,
          id,
          { ...includes, ...context },
          new NotFound(`Cannot find user identified by id = '${id}'`)
        ),
    getUserByEmail: (context?: TransactionContext) =>
      async (email: string): Promise<Either<AppError, User>> =>
        findOne<User>(
          User,
          { where: { email: email }, ...includes, ...context },
          new NotFound(`Cannot find user identified by email address '${email}'`)
        ),
    getUsers: (context?: TransactionContext) =>
      async (where?: WhereOptions, order?: Order): Promise<Either<AppError, User[]>> =>
        findAll<User>(User, { where, order, ...includes, ...context }),
    createUser: (context?: TransactionContext) =>
      async (userReq: UserRequired): Promise<Either<AppError, User>> =>
        create<User>(
          User,
          userReq,
          context
        ),
    updateUser: (context?: TransactionContext) =>
      async (user: User): Promise<Either<AppError, User>> =>
        update<User>(
          User,
          sanitizeEntity(user),
          { where: { id: user.id }, ...includes, ...context },
          new NotFound(`Cannot find user identified by id = '${user.id}'`)),
    deleteUser: (context?: TransactionContext) =>
      async (user: User): Promise<Either<AppError, number>> =>
        destroy<User>(
          User,
          { where: { id: user.id }, ...context }
        )
  };
};
