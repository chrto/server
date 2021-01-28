import getTokenSetUnbound from './getTokenSet';
import axios from 'axios';
import * as sniff from 'supersniff';
import { _do } from 'utils/either';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';

require('dotenv').config();

const AUTH_CODE = 'dda910ae-1e61-4793-8566-abf1f787e2b4.c77af9d0-9803-4948-8e2e-a10820545be9.352f1660-95a7-4b66-81ef-12f1868ba27f';
const config: ISSOConfig = {
  ssoClientId: process.env.SSO_CLIENT_ID,
  ssoRedirectUri: process.env.SSO_REDIRECT_URI,
  ssoClientSecret: process.env.SSO_CLIENT_SECRET,
  ssoTokenEndpoint: process.env.SSO_TOKEN_ENDPOINT
} as ISSOConfig;

getTokenSetUnbound
  .apply(null, [axios.create(), config])
  .apply(null, [{ auth_code: AUTH_CODE }])
  .then(_do({
    right: sniff,
    left: sniff
  }));
