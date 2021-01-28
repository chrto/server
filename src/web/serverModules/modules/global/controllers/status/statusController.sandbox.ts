import statusController from './statusController';
import authenticationService from 'service/http/authentication/authenticationService';
import modelFactory from 'model/sequelize/modelFactory/modelFactory';
import * as sniff from 'supersniff';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { IDatabaseConfig } from 'web/server/configuration/loader/database/databaseConfig.types';
import { DEFAULT_DB_DIALECT, DEFAULT_DB_URL } from 'src/defaults';
import { lift } from 'utils/either';
require('dotenv').config();

const SSO_CONFIG: ISSOConfig = {
  ssoWellKnown: process.env.SSO_WELL_KNOWN,
} as ISSOConfig;

const DB_CONFIG: IDatabaseConfig = {
  url: DEFAULT_DB_URL,
  allowLogging: false,
  allowSync: false,
  dialect: DEFAULT_DB_DIALECT
};

statusController
  .apply(null, [{ authenticationService: authenticationService(SSO_CONFIG), sdkStartStop: modelFactory(DB_CONFIG) }])
  .getStatus({}, {}, {})
  .then(lift(sniff));
