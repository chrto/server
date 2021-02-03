import sanitizeModel from 'model/sequelize/sanitizeModel/sanitizeModel';
import getUserByIdUnbound from './getUserById.unbound';

export default getUserByIdUnbound
  .apply(null, [sanitizeModel]);
