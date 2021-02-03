import sanitizeModel from 'model/sequelize/sanitizeModel/sanitizeModel';
import userFactory from 'model/sequelize/model/user/factory/userFactory';
import createUserUnbound from './createUser.unbound';
import bodyValidator from './validator/bodyValidator';
import emailNotExists from './validator/emailNotExists';

export default createUserUnbound
  .apply(null, [bodyValidator, emailNotExists, userFactory, sanitizeModel]);
