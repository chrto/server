import ping from './ping';
import * as sniff from 'supersniff';
import { _do } from 'utils/either';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';

require('dotenv').config();

const config: ISSOConfig = {
  ssoWellKnown: process.env.SSO_WELL_KNOWN,
} as ISSOConfig;

ping
  .apply(null, [config])
  .apply(null, [])
  .then(_do({
    right: sniff,
    left: sniff
  }));
