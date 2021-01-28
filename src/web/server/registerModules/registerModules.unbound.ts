import { Fcn } from 'common/types';
import { ServerFactoryParams } from '../factory/params/factoryParams.types';
import { ModuleMapping } from './registerModules.types';

export default (registerModule: Fcn<[ServerFactoryParams, ModuleMapping], Fcn<[string], void>>) =>
  (serverModuleMapping: ModuleMapping) =>
    (params: ServerFactoryParams): void => {
      Object.keys(serverModuleMapping)
        .forEach(registerModule(params, serverModuleMapping));
    };
