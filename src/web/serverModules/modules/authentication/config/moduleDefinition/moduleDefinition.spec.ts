import moduleDefinitionUnbound from './moduleDefinition.unbound';
import { expect as expectChai } from 'chai';
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
            expect(controllers.authenticationController)
              .toHaveBeenCalledTimes(1);
            expect(controllers.authenticationController)
              .toHaveBeenCalledWith(SERVICE);
            expectChai(controllers.authenticationController(SERVICE))
              .to.be.an('object')
              .which.is.deep.equal(CONTROLLER);
          });

          it(`Should set 'moduleDefinition' item in 'ModuleConfiguration' object`, () => {
            expectChai(result)
              .to.be.an('object');
            expectChai(result)
              .to.has.ownProperty('moduleDefinition')
              .which.is.an('object');
            expectChai(result.moduleDefinition)
              .to.be.an('object')
              .which.is.deep.equal(EXPECTED_MODULE_DEFINITION);
          });

          it(`Should keep rest of items`, () => {
            expectChai(result)
              .to.be.an('object');
            expectChai(result)
              .to.has.ownProperty('router')
              .which.is.equal(MODULE_CONFIG.router);
            expectChai(result)
              .to.has.ownProperty('contextFactory')
              .which.is.equal(MODULE_CONFIG.contextFactory);
          });
        });
      });
    });
  });
});
