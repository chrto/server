import { logError } from 'utils/logger';
import loadUserJWTUnbound from './loadUserJWT.unbound';

export default loadUserJWTUnbound.apply(null, [logError]);
