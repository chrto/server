import authenticationController from './authenticationController';
import { AuthenticationService } from 'service/http/authentication/types';
import { AuthenticationController } from './authenticationController.types';

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Authentication', () => {
      describe('controller', () => {
        describe('authentication', () => {
          const authenticationService: AuthenticationService = {} as AuthenticationService;
          let controller: AuthenticationController;
          beforeAll(() => {
            controller = authenticationController
              .apply(null, [{ authenticationService }]);
          });
          it('Happy path', () => {
            expect(controller).toBeObject;
            expect(controller).toHaveProperty('token');
            expect(controller).toHaveProperty('refreshToken');
          });
        });
      });
    });
  });
});
