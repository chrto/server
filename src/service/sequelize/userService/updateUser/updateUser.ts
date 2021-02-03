import updateUserUnbound from './updateUser.unbound';
import * as sequelizeStorage from 'storage/sequelize/sequelizeStorage';

export default updateUserUnbound
  .apply(null, [sequelizeStorage]);
