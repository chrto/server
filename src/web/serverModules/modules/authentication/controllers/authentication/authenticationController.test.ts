import authenticationController from './authenticationController';
import { expect as expectChai } from 'chai';
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
            expectChai(controller)
              .to.be.an('object');
            expectChai(controller)
              .which.haveOwnProperty('token');
            expectChai(controller)
              .which.haveOwnProperty('refreshToken');
          });
        });
      });
    });
  });
});
