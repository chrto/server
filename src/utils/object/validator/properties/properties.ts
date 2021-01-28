import propertiesUnbound, { check } from './properties.unbound';
import { isMissing } from 'utils/validation';

export { check };
export default propertiesUnbound
  .apply(null, [isMissing]);
