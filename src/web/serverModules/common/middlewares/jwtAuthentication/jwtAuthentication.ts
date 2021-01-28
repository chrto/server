import jwtAuthenticationUnbound from './jwtAuthentication.unbound';
import { expressJwtSecret } from 'jwks-rsa';
const jwt = require('express-jwt');

export default jwtAuthenticationUnbound.apply(null, [jwt, expressJwtSecret]);
