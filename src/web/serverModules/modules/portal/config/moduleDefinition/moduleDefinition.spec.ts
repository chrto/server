it('', () => { });
// import moduleDefinitionUnbound from './moduleDefinition.unbound';
// import { expect as expectChai } from 'chai';
// import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
// import { AuthorizationHandlers } from 'web/serverModules/common/authorization/authorization.types';
// import { ModuleConfig } from 'web/serverModules/types';
// import { Context as GlobalCOntext } from '../../context/context.types';
// import { ModuleDef } from 'web/serverModules/configuration/routes/register/registerRoutes.types';
// import { StatusController } from '../../controllers/status/statusController.types';
// import { GlobalModuleControllers } from '../../controllers/controllers.types';

// const CONTROLLER: StatusController = { getStatus: null };
// const AUTH_HANDLERS: AuthorizationHandlers = { allAuthenticated: null, isAdministrator: null };
// const SERVICE: PluginSdkService = { sdkStartStop: null, sdkTransaction: null, authenticationService: null, userService: null };
// const MODULE_CONFIG: ModuleConfig<GlobalCOntext> = { moduleDefinition: null, router: null, contextFactory: null };

// const EXPECTED_MODULE_DEFINITION: ModuleDef<GlobalCOntext> = {
//   '/status': {
//     get: {
//       action: CONTROLLER.getStatus,
//       authorization: AUTH_HANDLERS.allAuthenticated
//     }
//   }
// };

// describe('Web Server', () => {
//   describe('Modules', () => {
//     describe('Global', () => {
//       describe('Configuration', () => {
//         describe('Module definition', () => {
//           let controllers: GlobalModuleControllers = {} as GlobalModuleControllers;
//           let result: ModuleConfig<GlobalCOntext>;
//           beforeAll(() => {
//             controllers.statusController = jest.fn().mockReturnValue(CONTROLLER);

//             result = moduleDefinitionUnbound
//               .apply(null, [controllers, AUTH_HANDLERS])
//               .apply(null, [SERVICE])
//               .apply(null, [MODULE_CONFIG]);
//           });

//           it(`Should build required controllers for global module`, () => {
//             expect(controllers.statusController)
//               .toHaveBeenCalledTimes(1);
//             expect(controllers.statusController)
//               .toHaveBeenCalledWith(SERVICE);
//             expectChai(controllers.statusController(SERVICE))
//               .to.be.an('object')
//               .which.is.deep.equal(CONTROLLER);
//           });

//           it(`Should set 'moduleDefinition' item in 'ModuleConfiguration' object, after controller has been builded`, () => {
//             expectChai(result)
//               .to.be.an('object');
//             expectChai(result)
//               .to.has.ownProperty('moduleDefinition')
//               .which.is.an('object');
//             expectChai(result.moduleDefinition)
//               .to.be.an('object')
//               .which.is.deep.equal(EXPECTED_MODULE_DEFINITION);
//           });

//           it(`Should keep rest of items`, () => {
//             expectChai(result)
//               .to.be.an('object');
//             expectChai(result)
//               .to.has.ownProperty('router')
//               .which.is.equal(MODULE_CONFIG.router);
//             expectChai(result)
//               .to.has.ownProperty('contextFactory')
//               .which.is.equal(MODULE_CONFIG.contextFactory);
//           });
//         });
//       });
//     });
//   });
// });
