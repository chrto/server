import createUserUnbound from './createUser.unbound';
import userStorage from 'storage/sequelize/userStorage';

export default createUserUnbound
  .apply(null, [userStorage]);
