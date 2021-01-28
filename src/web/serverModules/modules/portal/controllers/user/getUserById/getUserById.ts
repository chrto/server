import getUserByIdUnbound from './getUserById.unbound';
import { sanitizeEntity } from 'service/sequelize/common/modelHelper';

export default getUserByIdUnbound
  .apply(null, [sanitizeEntity]);
