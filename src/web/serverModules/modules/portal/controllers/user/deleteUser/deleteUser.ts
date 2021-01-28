import deleteUserUnbound from './deleteUser.unbound';
import differentEntity from 'web/serverModules/common/authorization/validators/differentEntity/differentEntity';

export default deleteUserUnbound.apply(null, [differentEntity]);
