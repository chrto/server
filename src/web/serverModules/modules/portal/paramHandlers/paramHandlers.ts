import { ParamHandlers } from './paramHandlers.types';
import userParamHandler from './user/userParamHandler';

const paramHandlers: ParamHandlers = { user: userParamHandler };
export default paramHandlers;
