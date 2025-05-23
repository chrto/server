import currentUserController from './currentUserController';
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
            expect(controller).toBeInstanceOf(Object);
            expect(controller).toHaveProperty('getLoggedInUser');
          });
        });
      });
    });
  });
});
