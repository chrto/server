import logger from 'utils/logger';
import sequelizeModelFactoryUnbound from './sequelizeModelFactory.unbound';

export default sequelizeModelFactoryUnbound.apply(null, [logger]);
