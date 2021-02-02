import userFactory from 'model/sequelize/user/factory/userFactory';
import { sanitizeEntity } from 'service/sequelize/common/modelHelper';
import createUserUnbound from './createUser.unbound';
import bodyValidator from './validator/bodyValidator';
import emailNotExists from './validator/emailNotExists';

export default createUserUnbound
  .apply(null, [bodyValidator, emailNotExists, userFactory, sanitizeEntity]);
