import moduleDefinitionUnbound from './moduleDefinition.unbound';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { AuthorizationHandlers } from 'web/serverModules/common/authorization/authorization.types';
import { ModuleConfig } from 'web/serverModules/types';
import { Context as GlobalCOntext } from '../../context/context.types';
import { ModuleDef } from 'web/serverModules/configuration/routes/register/registerRoutes.types';
import { PortalModuleControllers } from '../../controllers/controllers.types';
import { UserController } from '../../controllers/user/userController.types';
import { CurrentUserController } from '../../controllers/currentUser/currentUserController.types';

const USER_CONTROLLER: UserController = { getUserById: null, getUsers: null, updateUser: null, createUser: null, deleteUser: null };
const CURR_USER_CONTROLLER: CurrentUserController = { getLoggedInUser: null };
const AUTH_HANDLERS: AuthorizationHandlers = { allAuthenticated: null, isAdministrator: null };
const SERVICE: PluginSdkService = { sdkStartStop: null, sdkTransaction: null, authenticationService: null, userService: null };
const MODULE_CONFIG: ModuleConfig<GlobalCOntext> = { moduleDefinition: null, router: null, contextFactory: null };

const EXPECTED_MODULE_DEFINITION: ModuleDef<GlobalCOntext> = {
  '/users': {
    get: {
      action: USER_CONTROLLER.getUsers,
      authorization: AUTH_HANDLERS.allAuthenticated
    },
    post: {
      action: USER_CONTROLLER.createUser,
      authorization: AUTH_HANDLERS.isAdministrator
    }
  },
  '/users/:userId': {
    get: {
      action: USER_CONTROLLER.getUserById,
      authorization: AUTH_HANDLERS.allAuthenticated
    },
    delete: {
      action: USER_CONTROLLER.deleteUser,
      authorization: AUTH_HANDLERS.isAdministrator
    },
    patch: {
      action: USER_CONTROLLER.updateUser,
      authorization: AUTH_HANDLERS.isAdministrator
    }
  },
  '/user/basic-info': {
    get: {
      action: CURR_USER_CONTROLLER.getLoggedInUser,
      authorization: AUTH_HANDLERS.allAuthenticated
    }
  }
};

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Global', () => {
      describe('Configuration', () => {
        describe('Module definition', () => {
          let controllers: PortalModuleControllers = {} as PortalModuleControllers;
          let result: ModuleConfig<GlobalCOntext>;
          beforeAll(() => {
            controllers.userController = jest.fn().mockReturnValue(USER_CONTROLLER);
            controllers.currentUserController = jest.fn().mockReturnValue(CURR_USER_CONTROLLER);

            result = moduleDefinitionUnbound
              .apply(null, [controllers, AUTH_HANDLERS])
              .apply(null, [SERVICE])
              .apply(null, [MODULE_CONFIG]);
          });

          it(`Should build user controller for portal module`, () => {
            expect(controllers.userController).toHaveBeenCalledTimes(1);
            expect(controllers.userController).toHaveBeenCalledWith(SERVICE);
            expect(controllers.userController(SERVICE)).toStrictEqual(USER_CONTROLLER);
          });

          it(`Should build current user controller for portal module`, () => {
            expect(controllers.currentUserController).toHaveBeenCalledTimes(1);
            expect(controllers.currentUserController).toHaveBeenCalledWith(SERVICE);
            expect(controllers.currentUserController(SERVICE)).toStrictEqual(CURR_USER_CONTROLLER);
          });

          it(`Should set 'moduleDefinition' item in 'ModuleConfiguration' object, after controller has been builded`, () => {
            expect(result).toBeObject;
            expect(result).toHaveProperty('moduleDefinition');
            expect(result.moduleDefinition).toBeObject;
            expect(result.moduleDefinition).toStrictEqual(EXPECTED_MODULE_DEFINITION);
          });

          it(`Should keep rest of items`, () => {
            expect(result).toBeObject;
            expect(result).toHaveProperty('router');
            expect(result.router).toStrictEqual(MODULE_CONFIG.router);
            expect(result).toHaveProperty('contextFactory');
            expect(result.contextFactory).toStrictEqual(MODULE_CONFIG.contextFactory);
          });
        });
      });
    });
  });
});
