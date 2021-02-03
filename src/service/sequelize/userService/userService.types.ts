import { OptionalExceptFor } from 'common/types';
import { User } from 'model/sequelize/model/user/user';
import { UserItems, UserRequired } from 'model/sequelize/model/user/user.types';
import { Order, WhereOptions } from 'sequelize/types';
import { SequelizeService } from '../types';

export interface UserService {
  getUserById: SequelizeService<[string], User>;
  getUserByEmail: SequelizeService<[string], User>;
  getUsers: SequelizeService<[WhereOptions?, Order?], User[]>;
  createUser: SequelizeService<[UserRequired], User>;
  updateUser: SequelizeService<[OptionalExceptFor<UserItems, 'id'>], User>;
  deleteUser: SequelizeService<[User], number>;
}
