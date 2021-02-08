import updateUserUnbound from './updateUser.unbound';
import userStorage from 'storage/sequelize/userStorage';

export default updateUserUnbound
  .apply(null, [userStorage]);
