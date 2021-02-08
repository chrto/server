
import getUserByIdUnbound from './getUserById.unbound';
import userStorage from 'storage/sequelize/userStorage';

export default getUserByIdUnbound
  .apply(null, [userStorage]);
