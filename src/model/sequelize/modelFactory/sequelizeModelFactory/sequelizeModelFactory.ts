import appLogger from 'logger/appLogger';
import sequelizeModelFactoryUnbound from './sequelizeModelFactory.unbound';

export default sequelizeModelFactoryUnbound.apply(null, [appLogger]);
