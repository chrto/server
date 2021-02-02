import jwtAuthenticationUnbound from './jwtAuthentication.unbound';
import { expressJwtSecret } from 'jwks-rsa';
import * as jwt from 'express-jwt';

export default jwtAuthenticationUnbound.apply(null, [jwt, expressJwtSecret]);
