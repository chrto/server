import getTokenSet from './getTokenSet';
import * as sniff from 'supersniff';
import { _do } from 'utils/either';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';

require('dotenv').config();

const AUTH_CODE = '01df9415-6991-445f-b5fa-f582f314dc2c.e1c0c9c9-e5d1-4c2d-92e2-b5f6cefe4e1f.352f1660-95a7-4b66-81ef-12f1868ba27f';
const config: ISSOConfig = {
  ssoClientId: process.env.SSO_CLIENT_ID,
  ssoRedirectUri: process.env.SSO_REDIRECT_URI,
  ssoClientSecret: process.env.SSO_CLIENT_SECRET,
  ssoTokenEndpoint: process.env.SSO_TOKEN_ENDPOINT
} as ISSOConfig;

getTokenSet
  .apply(null, [config])
  .apply(null, [{ auth_code: AUTH_CODE }])
  .then(_do({
    right: sniff,
    left: sniff
  }));
