
import getUserByIdUnbound from './getUserById.unbound';
import * as sequelizeStorage from 'storage/sequelize/sequelizeStorage';

export default getUserByIdUnbound
  .apply(null, [sequelizeStorage]);
