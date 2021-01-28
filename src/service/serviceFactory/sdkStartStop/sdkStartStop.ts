import { AsyncStartStop, PluginSdkSequelize } from 'model/sequelize/modelFactory/modelFactory.types';

export default (sdkSequelize: PluginSdkSequelize): AsyncStartStop => ({
  start: async () => sdkSequelize.start(),
  stop: async () => sdkSequelize.stop()
});
