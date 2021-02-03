import updateUserUnbound from './updateUser.unbound';
import bodyValidator from './validator/bodyValidator';
import authorizationValidator from './validator/authorizationValidator';
import sanitizeModel from 'model/sequelize/sanitizeModel/sanitizeModel';

export default updateUserUnbound
  .apply(null, [bodyValidator, authorizationValidator, sanitizeModel]);
