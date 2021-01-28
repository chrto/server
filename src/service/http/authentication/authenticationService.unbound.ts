import { AxiosInstance } from 'axios';
import { AuthenticationService } from './types';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';

import getTokensSet from './getTokenSet/getTokenSet';
import refreshTokens from './refreshTokens/refreshTokens';
import logOut from './logOut/logOut';
import ping from './ping/ping';

export default (instance: AxiosInstance) =>
  (ssoConfig: ISSOConfig): AuthenticationService => ({
    getTokensSet: getTokensSet.apply(null, [instance, ssoConfig]),
    refreshTokens: refreshTokens.apply(null, [instance, ssoConfig]),
    logOut: logOut.apply(null, [instance, ssoConfig]),
    ping: ping.apply(null, [instance, ssoConfig])
  });
