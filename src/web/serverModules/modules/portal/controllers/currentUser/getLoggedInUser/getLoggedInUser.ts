import sanitizeModel from 'model/sequelize/sanitizeModel/sanitizeModel';
import getLoggedInUserUnbound from './getLoggedInUser.unbound';

export default getLoggedInUserUnbound
  .apply(null, [sanitizeModel]);
