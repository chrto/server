import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { AuthorizationHandlers } from 'web/serverModules/common/authorization/authorization.types';
import { ModuleConfig } from 'web/serverModules/types';
import { AuthenticationController } from '../../controllers/authentication/authenticationController.types';
import { AuthenticationModuleControllers } from '../../controllers/controllers.types';

export default (
  { authenticationController }: AuthenticationModuleControllers,
  { allAuthenticated }: AuthorizationHandlers
) =>
  <CTX>(service: PluginSdkService) =>
    (moduleConfig: ModuleConfig<CTX>): ModuleConfig<CTX> => {
      const { token, refreshToken }: AuthenticationController = authenticationController(service);

      return {
        ...moduleConfig,
        moduleDefinition: {
          '/token': {
            get: {
              action: token,
              authorization: allAuthenticated
            }
          },
          '/token/refresh': {
            get: {
              action: refreshToken,
              authorization: allAuthenticated
            }
          }
        }
      };
    };
