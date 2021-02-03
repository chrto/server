import deleteUserUnbound from './deleteUser.unbound';
import * as sequelizeStorage from 'storage/sequelize/sequelizeStorage';

export default deleteUserUnbound
  .apply(null, [sequelizeStorage]);
