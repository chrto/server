import initUserModel from './../../user/user';
import { InitModels } from './sequelizeInit.types';
import sequelizeInitUnbound from './sequelizeInit.unbound';

const initModel: InitModels = {
  userModel: initUserModel
};

export default sequelizeInitUnbound.apply(null, [initModel]);
