import moduleDefinitionUnbound from './moduleDefinition.unbound';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { AuthorizationHandlers } from 'web/serverModules/common/authorization/authorization.types';
import { ModuleConfig } from 'web/serverModules/types';
import { Context as AuthContext } from '../../context/context.types';
import { AuthenticationModuleControllers } from '../../controllers/controllers.types';
import { AuthenticationController } from '../../controllers/authentication/authenticationController.types';
import { ModuleDef } from 'web/serverModules/configuration/routes/register/registerRoutes.types';

const CONTROLLER: AuthenticationController = { token: null, refreshToken: null };
const AUTH_HANDLERS: AuthorizationHandlers = { allAuthenticated: null, isAdministrator: null };
const SERVICE: PluginSdkService = { sdkStartStop: null, sdkTransaction: null, authenticationService: null, userService: null };
const MODULE_CONFIG: ModuleConfig<AuthContext> = { moduleDefinition: null, router: null, contextFactory: null };
const EXPECTED_MODULE_DEFINITION: ModuleDef<AuthContext> = {
  '/token': {
    get: {
      action: CONTROLLER.token,
      authorization: AUTH_HANDLERS.allAuthenticated
    }
  },
  '/token/refresh': {
    get: {
      action: CONTROLLER.refreshToken,
      authorization: AUTH_HANDLERS.allAuthenticated
    }
  }
};

describe('Web Server', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Modules', () => {
    describe('Authentication', () => {
      describe('Configuration', () => {
        describe('Module definition', () => {
          let controllers: AuthenticationModuleControllers = {} as AuthenticationModuleControllers;
          let result: ModuleConfig<AuthContext>;
          beforeAll(() => {
            controllers.authenticationController = jest.fn().mockReturnValue(CONTROLLER);

            result = moduleDefinitionUnbound
              .apply(null, [controllers, AUTH_HANDLERS])
              .apply(null, [SERVICE])
              .apply(null, [MODULE_CONFIG]);
          });

          it(`Should build authentication controller`, () => {
            const controller = controllers.authenticationController(SERVICE);
            expect(controllers.authenticationController).toHaveBeenCalledTimes(1);
            expect(controllers.authenticationController).toHaveBeenCalledWith(SERVICE);
            expect(controller).toBeObject;
            expect(controller).toStrictEqual(CONTROLLER);
          });

          it(`Should set 'moduleDefinition' item in 'ModuleConfiguration' object`, () => {
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
