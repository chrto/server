import getUserByEmailUnbound from './getUserByEmail.unbound';
import userStorage from 'storage/sequelize/userStorage';

export default getUserByEmailUnbound
  .apply(null, [userStorage]);
