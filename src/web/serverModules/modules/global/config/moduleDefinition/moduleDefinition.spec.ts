
import moduleDefinitionUnbound from './moduleDefinition.unbound';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { AuthorizationHandlers } from 'web/serverModules/common/authorization/authorization.types';
import { ModuleConfig } from 'web/serverModules/types';
import { Context as GlobalCOntext } from '../../context/context.types';
import { ModuleDef } from 'web/serverModules/configuration/routes/register/registerRoutes.types';
import { StatusController } from '../../controllers/status/statusController.types';
import { GlobalModuleControllers } from '../../controllers/controllers.types';

const CONTROLLER: StatusController = { getStatus: null };
const AUTH_HANDLERS: AuthorizationHandlers = { allAuthenticated: null, isAdministrator: null };
const SERVICE: PluginSdkService = { sdkStartStop: null, sdkTransaction: null, authenticationService: null, userService: null };
const MODULE_CONFIG: ModuleConfig<GlobalCOntext> = { moduleDefinition: null, router: null, contextFactory: null };

const EXPECTED_MODULE_DEFINITION: ModuleDef<GlobalCOntext> = {
  '/status': {
    get: {
      action: CONTROLLER.getStatus,
      authorization: AUTH_HANDLERS.allAuthenticated
    }
  }
};

describe('Web Server', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Modules', () => {
    describe('Global', () => {
      describe('Configuration', () => {
        describe('Module definition', () => {
          let controllers: GlobalModuleControllers = {} as GlobalModuleControllers;
          let result: ModuleConfig<GlobalCOntext>;
          beforeAll(() => {
            controllers.statusController = jest.fn().mockReturnValue(CONTROLLER);

            result = moduleDefinitionUnbound
              .apply(null, [controllers, AUTH_HANDLERS])
              .apply(null, [SERVICE])
              .apply(null, [MODULE_CONFIG]);
          });

          it(`Should build required controllers for global module`, () => {
            const controller = controllers.statusController(SERVICE);

            expect(controllers.statusController).toHaveBeenCalledTimes(1);
            expect(controllers.statusController).toHaveBeenCalledWith(SERVICE);
            expect(controller).toBeObject;
            expect(controller).toStrictEqual(CONTROLLER);
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
