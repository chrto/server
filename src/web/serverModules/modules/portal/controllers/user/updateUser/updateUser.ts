import { sanitizeEntity } from 'service/sequelize/common/modelHelper';
import updateUserUnbound from './updateUser.unbound';
import bodyValidator from './validator/bodyValidator';
import authorizationValidator from './validator/authorizationValidator';

export default updateUserUnbound
  .apply(null, [bodyValidator, authorizationValidator, sanitizeEntity]);
