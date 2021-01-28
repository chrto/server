import currentUserController from './currentUserController';
import { expect as expectChai } from 'chai';
import { CurrentUserController } from './currentUserController.types';

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Portal', () => {
      describe('controller', () => {
        describe('current user controller', () => {
          let controller: CurrentUserController;

          beforeAll(() => {
            controller = currentUserController
              .apply(null, [{}]);
          });

          it('Happy path', () => {
            expectChai(controller)
              .to.be.an('object');
            expectChai(controller)
              .which.haveOwnProperty('getLoggedInUser');
          });
        });
      });
    });
  });
});
