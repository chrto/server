import sequelizeStorage from './factory/sequelizeStorage';
import { User } from 'model/sequelize/model/user/user';
import { SequelizeStorage } from './factory/sequelizeStorage.types';

const userStorage: SequelizeStorage<User> = sequelizeStorage(User);
export default userStorage;
