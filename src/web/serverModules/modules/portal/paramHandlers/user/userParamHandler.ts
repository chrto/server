import userParamHandlerUnbound from './userParamHandler.unbound';
import addEntityInToRequestImplicits from 'web/serverModules/common/paramHandlers/addEntityInToRequestImplicits/addEntityInToRequestImplicits';
import handleError from 'web/serverModules/common/paramHandlers/handleError/handleError';
import { isUuid } from 'utils/validation';

export default userParamHandlerUnbound
  .apply(null, [addEntityInToRequestImplicits, handleError, isUuid]);
