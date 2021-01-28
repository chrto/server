import allAuthenticated from './allAuthenticated/allAuthenticated';
import isAdministrator from './isAdministrator/isAdministrator';
import { AuthorizationHandlers } from './authorization.types';

const authorization: AuthorizationHandlers = { allAuthenticated, isAdministrator };
export default authorization;
