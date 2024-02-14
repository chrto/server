import { AppError } from 'common/error';
import userFactoryUnbound from './userFactory.unbound';
import { Factory } from 'common/types';
import { Either } from 'tsmonad';
import { UserRequired, UserItems, UserRole } from '../user.types';

describe('sequelize model', () => {
  describe('user', () => {
    describe('factory', () => {
      const UUID: string = 'f923b2c9-ffcf-4a0a-bdc9-a4a4ae2a687e';
      const uuidGenrator: () => string = () => UUID;
      const userFactory: Factory<UserRequired, Either<AppError, UserItems>> = userFactoryUnbound.apply(null, [uuidGenrator]);
      const userRequired: UserRequired = {
        firstName: 'Joe',
        lastName: 'Doe',
        email: 'joe.doe@company.com'
      };
      it('Should return user items in right side', () => {
        const expected: UserItems = {
          id: UUID,
          firstName: userRequired.firstName,
          lastName: userRequired.lastName,
          email: userRequired.email,
          role: UserRole.Admin,
          active: false
        };
        userFactory({ ...userRequired, role: UserRole.Admin, active: false })
          .do({
            right: (items: UserItems) =>
              expect(items).toStrictEqual(expected),
            left: (error: AppError) =>
              fail(`Left side has not been expected: ${error.message}`)
          });
      });

      it(`Default role should by 'User'`, () => {
        userFactory(userRequired)
          .do({
            right: (items: UserItems) =>
              expect(items.role).toEqual(UserRole.User),
            left: (error: AppError) =>
              fail(`Left side has not been expected: ${error.message}`)
          });
      });

      it(`Default active should by true`, () => {
        userFactory(userRequired)
          .do({
            right: (items: UserItems) =>
              expect(items.active).toBeTrue,
            left: (error: AppError) =>
              fail(`Left side has not been expected: ${error.message}`)
          });
      });
    });
  });
});
