import userService from './userService';
import { UserService } from './userService.types';

describe('Service', () => {
  describe('Sequelize', () => {
    describe('User Service', () => {
      let service: UserService;

      beforeAll(() => {
        service = userService
          .apply(null, []);
      });

      it('Happy path', () => {
        expect(service).toBeInstanceOf(Object);
        expect(service).toHaveProperty('getUserById');
        expect(service).toHaveProperty('getUserByEmail');
        expect(service).toHaveProperty('getUsers');
        expect(service).toHaveProperty('createUser');
        expect(service).toHaveProperty('updateUser');
        expect(service).toHaveProperty('deleteUser');
      });
    });
  });
});
