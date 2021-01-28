import { IDatabaseConfig } from 'web/server/configuration/loader/database/databaseConfig.types';
import { Options } from 'sequelize/types';

export default (dbConfig: IDatabaseConfig): Options => ({
  dialect: dbConfig.dialect,
  storage: dbConfig.url,
  logging: dbConfig.allowLogging,
  define: {
    timestamps: true
  }
});
