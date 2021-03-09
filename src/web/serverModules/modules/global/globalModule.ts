import globalModuleUnbound from './globalModule.unbound';
import moduleDefinition from './config/moduleDefinition/moduleDefinition';
import moduleMiddlewares from './config/moduleMiddlewares/moduleMiddlewares';
import regiserRoutes from 'web/serverModules/configuration/routes/register/registerRoutes';
import registerErrorHandlerMiddleware from 'web/serverModules/configuration/middlewares/registerErrorHandlerMiddleware';
import contextFactory from './context/context';
import { Router } from 'express';
import appLogger from 'logger/appLogger';

export default globalModuleUnbound
  .apply(null, [
    appLogger,
    moduleDefinition,
    moduleMiddlewares,
    registerErrorHandlerMiddleware,
    regiserRoutes
  ])
  .apply(null, [{ router: Router(), contextFactory, moduleDefinition: null }]);
