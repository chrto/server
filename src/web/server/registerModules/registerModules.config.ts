import globalModule from '../../serverModules/modules/global/globalModule';
import authenticationModule from '../../serverModules/modules/authentication/authenticationModule';
import portalModule from '../../serverModules/modules/portal/portalModule';
import { ModuleMapping } from './registerModules.types';

const MODULE_MAPPING: ModuleMapping = {
  global: {
    routerPath: '/api/v1/global',
    routerConfigurator: globalModule
  },
  authentication: {
    routerPath: '/api/v1/auth',
    routerConfigurator: authenticationModule
  },
  portal: {
    routerPath: '/api/v1/portal',
    routerConfigurator: portalModule
  }
};

export default MODULE_MAPPING;
