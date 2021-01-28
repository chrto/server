import authenticationServiceUnbound from './authenticationService.unbound';
import { expect as expectChai } from 'chai';
import { AuthenticationService } from './types';
import { AxiosInstance } from 'axios';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';

describe(`service`, () => {
  describe(`authentication`, () => {
    const axiosInstance: AxiosInstance = {} as AxiosInstance;
    const ssoConfig: ISSOConfig = {} as ISSOConfig;
    let authenticationService: AuthenticationService;
    beforeAll(() => {
      authenticationService = authenticationServiceUnbound
        .apply(null, [axiosInstance])
        .apply(null, [ssoConfig]);
    });
    it('Happy path', () => {
      expectChai(authenticationService)
        .to.be.an('object');
      expectChai(authenticationService)
        .which.haveOwnProperty('getTokensSet');
      expectChai(authenticationService)
        .which.haveOwnProperty('refreshTokens');
      expectChai(authenticationService)
        .which.haveOwnProperty('logOut');
      expectChai(authenticationService)
        .which.haveOwnProperty('ping');
    });
  });
});
