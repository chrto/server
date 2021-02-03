import getUsersUnbound from './getUsers.unbound';
import * as sequelizeStorage from 'storage/sequelize/sequelizeStorage';

export default getUsersUnbound
  .apply(null, [sequelizeStorage]);
