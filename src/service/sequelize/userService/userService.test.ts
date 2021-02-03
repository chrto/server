import userService from './userService';
import { expect as expectChai } from 'chai';
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
        expectChai(service)
          .to.be.an({}.constructor.name);
        expectChai(service)
          .which.haveOwnProperty('getUserById');
        expectChai(service)
          .which.haveOwnProperty('getUserByEmail');
        expectChai(service)
          .which.haveOwnProperty('getUsers');
        expectChai(service)
          .which.haveOwnProperty('createUser');
        expectChai(service)
          .which.haveOwnProperty('updateUser');
        expectChai(service)
          .which.haveOwnProperty('deleteUser');
      });
    });
  });
});
