// import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
// import { AuthorizationHandlers } from 'web/serverModules/common/authorization/authorization.types';
// import { ModuleConfig } from 'web/serverModules/types';
// import { GlobalModuleControllers } from '../../controllers/controllers.types';
// import { StatusController } from '../../controllers/status/statusController.types';

// export default (
//   { statusController }: GlobalModuleControllers,
//   { allAuthenticated }: AuthorizationHandlers
// ) =>
//   <CTX>(service: PluginSdkService) =>
//     (moduleConfig: ModuleConfig<CTX>): ModuleConfig<CTX> => {
//       const { getStatus }: StatusController = statusController(service);

//       return {
//         ...moduleConfig,
//         moduleDefinition: {
//           '/users': {
//             get: {
//               action: userController.getUsers,
//               authorization: allAuthenticated
//             },
//             post: {
//               action: userController.createUser,
//               authorization: isAdministrator
//             }
//           },

//           '/users/:userId': {
//             get: {
//               action: userController.getUserById,
//               authorization: allAuthenticated
//             },
//             delete: {
//               action: userController.deleteUser,
//               authorization: isAdministrator
//             },
//             patch: {
//               action: userController.updateUser,
//               authorization: isAdministrator
//             }
//           },

//           '/user/basic-info': {
//             get: {
//               action: userController.getLoggedInUser,
//               authorization: allAuthenticated
//             }
//           }
//         }
//       };
//     };
