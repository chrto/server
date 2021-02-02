import userController from './userController';
import { expect as expectChai } from 'chai';
import { UserController } from './userController.types';

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Portal', () => {
      describe('controller', () => {
        describe('user controller', () => {
          let controller: UserController;

          beforeAll(() => {
            controller = userController
              .apply(null, [{ userService: {} }]);
          });

          it('Happy path', () => {
            expectChai(controller)
              .to.be.an('object');
            expectChai(controller)
              .which.haveOwnProperty('getUserById');
            expectChai(controller)
              .which.haveOwnProperty('deleteUser');
            expectChai(controller)
              .which.haveOwnProperty('updateUser');
            expectChai(controller)
              .which.haveOwnProperty('getUsers');
            expectChai(controller)
              .which.haveOwnProperty('createUser');
          });
        });
      });
    });
  });
});
