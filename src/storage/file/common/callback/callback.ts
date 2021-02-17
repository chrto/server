import callbackUnbound from './callback.unbound';
import { isMissing } from 'utils/validation';

export default callbackUnbound.apply(null, [isMissing]);
