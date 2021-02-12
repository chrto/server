import authenticationService from './authenticationService';
import { expect as expectChai } from 'chai';
import { AuthenticationService } from './types';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';

const CONFIG: ISSOConfig = {} as ISSOConfig;
describe(`service`, () => {
  describe(`authentication`, () => {
    let service: AuthenticationService;
    beforeAll(() => {
      service = authenticationService
        .apply(null, [CONFIG]);
    });
    it('Should build authentication service', () => {
      expectChai(service)
        .to.be.an('object');
      expectChai(service)
        .which.haveOwnProperty('getTokensSet');
      expectChai(service)
        .which.haveOwnProperty('refreshTokens');
      expectChai(service)
        .which.haveOwnProperty('logOut');
      expectChai(service)
        .which.haveOwnProperty('ping');
    });
  });
});
