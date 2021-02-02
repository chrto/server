import { ParamHandlers } from 'web/serverModules/configuration/paramHandlers/moduleParamHandler.types';
import { ModuleParams, RequestImplicits } from './paramHandlers.types';
import userParamHandler from './user/userParamHandler';

const paramHandlers: ParamHandlers<ModuleParams, RequestImplicits> = { userId: userParamHandler };
export default paramHandlers;
