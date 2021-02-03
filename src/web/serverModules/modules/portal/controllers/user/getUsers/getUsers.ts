import sanitizeModels from 'model/sequelize/sanitizeModel/sanitizeModels';
import getUsersUnbound from './getUsers.unbound';

export default getUsersUnbound
  .apply(null, [sanitizeModels]);
