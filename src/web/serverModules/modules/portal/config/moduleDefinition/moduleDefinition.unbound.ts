import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { AuthorizationHandlers } from 'web/serverModules/common/authorization/authorization.types';
import { ModuleConfig } from 'web/serverModules/types';
import { Context } from '../../context/context.types';
import { PortalModuleControllers } from '../../controllers/controllers.types';
import { CurrentUserController } from '../../controllers/currentUser/currentUserController.types';
import { UserController } from '../../controllers/user/userController.types';
import { ModuleParams } from '../../paramHandlers/paramHandlers.types';

export default (
  { currentUserController, userController }: PortalModuleControllers,
  { allAuthenticated, isAdministrator }: AuthorizationHandlers
) =>
  <CTX extends Context> (service: PluginSdkService) =>
    (moduleConfig: ModuleConfig<CTX>): ModuleConfig<CTX> => {
      const { getUsers, createUser, getUserById, deleteUser, updateUser }: UserController = userController(service);
      const { getLoggedInUser }: CurrentUserController = currentUserController(service);

      return {
        ...moduleConfig,
        moduleDefinition: {
          [`/users`]: {
            get: {
              action: getUsers,
              authorization: allAuthenticated
            },
            post: {
              action: createUser,
              authorization: isAdministrator
            }
          },

          [`/users/:${ModuleParams.userId}`]: {
            get: {
              action: getUserById,
              authorization: allAuthenticated
            },
            delete: {
              action: deleteUser,
              authorization: isAdministrator
            },
            patch: {
              action: updateUser,
              authorization: isAdministrator
            }
          },

          [`/user/basic-info`]: {
            get: {
              action: getLoggedInUser,
              authorization: allAuthenticated
            }
          }
        }
      };
    };
