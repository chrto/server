import ping from './ping';
import doer from 'utils/either/do/doer';
import * as sniff from 'supersniff';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';

require('dotenv').config();

const config: ISSOConfig = {
  ssoWellKnown: process.env.SSO_WELL_KNOWN,
} as ISSOConfig;

ping
  .apply(null, [config])
  .apply(null, [])
  .then(doer({
    right: sniff,
    left: sniff
  }));
