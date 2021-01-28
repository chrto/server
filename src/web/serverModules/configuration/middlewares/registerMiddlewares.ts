import { Middleware } from 'web/serverModules/common/middlewares/middlewares.types';
import { ModuleConfig } from 'web/serverModules/types';

export default (middlewares: Middleware[]) =>
  <CTX>(moduleConfig: ModuleConfig<CTX>): ModuleConfig<CTX> =>
    (moduleConfig.router.use(middlewares), moduleConfig);
