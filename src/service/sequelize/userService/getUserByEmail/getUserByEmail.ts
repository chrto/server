import getUserByEmailUnbound from './getUserByEmail.unbound';
import * as sequelizeStorage from 'storage/sequelize/sequelizeStorage';

export default getUserByEmailUnbound
  .apply(null, [sequelizeStorage]);
