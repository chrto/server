import statusController from './statusController';
import { expect as expectChai } from 'chai';
import { StatusController } from './statusController.types';
import { AuthenticationService } from 'service/http/authentication/types';
import { AsyncStartStop } from 'model/sequelize/modelFactory/modelFactory.types';

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Global', () => {
      describe('controller', () => {
        describe('status', () => {
          const authenticationService: AuthenticationService = {} as AuthenticationService;
          const sdkStartStop: AsyncStartStop = {} as AsyncStartStop;

          let controller: StatusController;
          beforeAll(() => {
            controller = statusController
              .apply(null, [{ authenticationService, sdkStartStop }]);
          });
          it('Happy path', () => {
            expectChai(controller)
              .to.be.an('object');
            expectChai(controller)
              .which.haveOwnProperty('getStatus');
          });
        });
      });
    });
  });
});
