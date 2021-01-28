import databaseConfigUnbound from './databaseConfig.unbound';

export default databaseConfigUnbound.apply(null, [process.env]);
