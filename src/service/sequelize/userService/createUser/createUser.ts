import createUserUnbound from './createUser.unbound';
import * as sequelizeStorage from 'storage/sequelize/sequelizeStorage';

export default createUserUnbound
  .apply(null, [sequelizeStorage]);
