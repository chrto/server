import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { TransactionContext } from 'model/sequelize/modelFactory/modelFactory.types';
import { User } from 'model/sequelize/user/user';
import { UserRequired } from 'model/sequelize/user/user.types';
import { Order, WhereOptions } from 'sequelize/types';

export interface UserService {
  getUserById: (context?: TransactionContext) => (id: string) => Promise<Either<AppError, User>>;
  getUserByEmail: (context?: TransactionContext) => (email: string) => Promise<Either<AppError, User>>;
  getUsers: (context?: TransactionContext) => (where?: WhereOptions, order?: Order) => Promise<Either<AppError, User[]>>;
  createUser: (context?: TransactionContext) => (userReq: UserRequired) => Promise<Either<AppError, User>>;
  updateUser: (context?: TransactionContext) => (user: User) => Promise<Either<AppError, User>>;
  deleteUser: (context?: TransactionContext) => (user: User) => Promise<Either<AppError, number>>;
}
