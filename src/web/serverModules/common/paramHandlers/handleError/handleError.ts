import handleErrorUnbound from './handleError.unbound';
import { isMissing } from 'utils/validation';

export default handleErrorUnbound.apply(null, [isMissing]);
