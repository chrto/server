import { sanitizeEntities } from 'service/sequelize/common/modelHelper';
import getUsersUnbound from './getUsers.unbound';

export default getUsersUnbound
  .apply(null, [sanitizeEntities]);
