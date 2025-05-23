import authenticationService from './authenticationService';
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
      expect(service).toBeInstanceOf(Object);
      expect(service).toHaveProperty('getTokensSet');
      expect(service).toHaveProperty('refreshTokens');
      expect(service).toHaveProperty('logOut');
      expect(service).toHaveProperty('ping');
    });
  });
});
