import userController from './userController';
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
            expect(controller).toBeInstanceOf(Object);
            expect(controller).toHaveProperty('getUserById');
            expect(controller).toHaveProperty('deleteUser');
            expect(controller).toHaveProperty('updateUser');
            expect(controller).toHaveProperty('getUsers');
            expect(controller).toHaveProperty('createUser');
          });
        });
      });
    });
  });
});
