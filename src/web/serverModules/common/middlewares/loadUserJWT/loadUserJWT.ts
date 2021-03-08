import logError from 'logger/logError';
import loadUserJWTUnbound from './loadUserJWT.unbound';

export default loadUserJWTUnbound.apply(null, [logError]);
