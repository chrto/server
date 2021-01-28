import regiserRoutes from 'web/serverModules/configuration/routes/register/registerRoutes';
import { ModuleDef } from 'web/serverModules/configuration/routes/register/registerRoutes.types';
import { Router } from 'express';
import errorHandler from 'web/serverModules/common/middlewares/errorHandler/errorHandler';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import authenticationErrorHandler from '../../common/middlewares/authenticationErrorHandler/authenticationErrorHandler';
import jwtAuthentication from '../../common/middlewares/jwtAuthentication/jwtAuthentication';
import loadUserJWT from '../../common/middlewares/loadUserJWT/loadUserJWT';
import { Context as PortalContext } from './context/context.types';
import UserController from './controllers/user/userController';
import allAuthenticated from 'web/serverModules/common/authorization/allAuthenticated/allAuthenticated';
import isAdministrator from 'web/serverModules/common/authorization/isAdministrator/isAdministrator';
import contextFactory from './context/context';

import moduleMiddlewares from './config/moduleMiddlewares/moduleMiddlewares';
import paramHandlers from './paramHandlers/paramHandlers';
import controllers from './controllers/controllers';

export default (service: PluginSdkService, appConfig: AppConfig): Router => {
  const { currentUserController } = controllers;
  const userController = UserController(service);
  const cuc = currentUserController(service);
  const moduleDefinition: ModuleDef<PortalContext> = {
    '/users': {
      get: {
        action: userController.getUsers,
        authorization: allAuthenticated
      },
      post: {
        action: userController.createUser,
        authorization: isAdministrator
      }
    },

    '/users/:userId': {
      get: {
        action: userController.getUserById,
        authorization: allAuthenticated
      },
      delete: {
        action: userController.deleteUser,
        authorization: isAdministrator
      },
      patch: {
        action: userController.updateUser,
        authorization: isAdministrator
      }
    },

    '/user/basic-info': {
      get: {
        action: cuc.getLoggedInUser,
        authorization: allAuthenticated
      }
    }
  };

  const router = Router();
  moduleMiddlewares({ router });

  router.use(jwtAuthentication(appConfig.sso));
  router.use(loadUserJWT(service));
  router.use(authenticationErrorHandler);

  const { user } = paramHandlers;
  router.param('userId', user(service));

  regiserRoutes({ moduleDefinition, router, contextFactory });
  // register error handler(s)
  router.use(errorHandler);

  return router;
};
