import authenticationService from '../http/authentication/authenticationService';
import userService from '../sequelize/userService/userService';
import pluginSdkServiceUnbound from './serviceFactory.unbound';

export default pluginSdkServiceUnbound.apply(null, [authenticationService, userService]);
