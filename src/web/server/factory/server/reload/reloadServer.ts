import rebuildServerUnbound from './reloadServer.unbound';
import modelFactory from 'model/sequelize/modelFactory/modelFactory';
import serviceFactory from 'service/serviceFactory/serviceFactory';
import registerModules from 'web/server/registerModules/registerModules';
import unregisterRouters from 'web/serverModules/configuration/routes/unregister/unregisterRouters'

export default rebuildServerUnbound.apply(null, [serviceFactory, modelFactory, unregisterRouters, registerModules]);
