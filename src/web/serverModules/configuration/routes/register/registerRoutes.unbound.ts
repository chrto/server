import { Fcn } from 'common/types';
import { Response } from 'express';
import { ModuleConfig } from 'web/serverModules/types';

export default <CTX, RB>(
  registerRoute: Fcn<[ModuleConfig<CTX>, Fcn<[Response<RB>], Fcn<[RB], Response<RB>>>], Fcn<[string], void>>,
  sendResult: Fcn<[Response<RB>], Fcn<[RB], Response<RB>>>
) =>
  (moduleConfig: ModuleConfig<CTX>): ModuleConfig<CTX> => (
    Object.keys(moduleConfig.moduleDefinition)
      .forEach(registerRoute(moduleConfig, sendResult)),
    moduleConfig
  );
