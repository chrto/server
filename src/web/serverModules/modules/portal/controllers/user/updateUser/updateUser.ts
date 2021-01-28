import { sanitizeEntity } from 'service/sequelize/common/modelHelper';
import updateUserUnbound from './updateUser.unbound';
import bodyValidator from './validator/bodyValidator';

export default updateUserUnbound
  .apply(null, [bodyValidator, sanitizeEntity]);
