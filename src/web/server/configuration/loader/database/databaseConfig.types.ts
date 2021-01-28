export enum EDatabaseDialect {
  mysql = 'mysql',
  mssql = 'mssql',
  sqlite = 'sqlite',
  postgres = 'postgres'
}

export interface IDatabaseConfig {
  url: string;
  dialect?: EDatabaseDialect;
  allowSync: boolean;
  allowLogging: boolean;
}
