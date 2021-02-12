import { AuthenticationService } from './types';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';

import getTokensSet from './getTokenSet/getTokenSet';
import refreshTokens from './refreshTokens/refreshTokens';
import logOut from './logOut/logOut';
import ping from './ping/ping';

export default (ssoConfig: ISSOConfig): AuthenticationService => ({
  getTokensSet: getTokensSet(ssoConfig),
  refreshTokens: refreshTokens(ssoConfig),
  logOut: logOut(ssoConfig),
  ping: ping(ssoConfig)
});
