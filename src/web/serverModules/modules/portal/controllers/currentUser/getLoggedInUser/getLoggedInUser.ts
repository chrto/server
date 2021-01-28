import { sanitizeEntity } from 'service/sequelize/common/modelHelper';
import getLoggedInUserUnbound from './getLoggedInUser.unbound';

export default getLoggedInUserUnbound
  .apply(null, [sanitizeEntity]);
