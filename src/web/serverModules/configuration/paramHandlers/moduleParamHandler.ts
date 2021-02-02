import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { ModuleConfig } from 'web/serverModules/types';
import { ParamHandlers } from './moduleParamHandler.types';

export default <MP extends string, RI extends object> (handlers: ParamHandlers<MP, RI>) =>
  (service: PluginSdkService) =>
    <CTX> (config: ModuleConfig<CTX>): ModuleConfig<CTX> => {
      Object.keys(handlers)
        .forEach((handler: string) => {
          config.router.param(handler, handlers[handler](service));
        });
      return config;
    };
