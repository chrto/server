import emailNotExists from './emailNotExists';
import doer from 'utils/monad/either/do/doer';
import { AppError } from 'common/error';
import { User } from 'model/sequelize/model/user/user';
import { Either } from 'tsmonad';
import { UserBody } from '../createUser.types';
import { Conflict, NotFound } from 'common/httpErrors';
import { UserService } from 'service/sequelize/userService/userService.types';

const USER: User = {
  email: 'joe.doe@company.com'
} as User;

const BODY: UserBody = {
  email: USER.email
};

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Portal', () => {
      describe('controller', () => {
        describe('user controller', () => {
          describe('create user', () => {
            describe('is email registered validator', () => {
              let userService: Partial<UserService>;
              let getUserByMailExecutor: jest.Mock<Promise<Either<AppError, User>>, [string]>;

              beforeAll(() => {
                userService = {
                  getUserByEmail: jest.fn().mockImplementation(() => getUserByMailExecutor)
                };
              });

              it(`Should return Either with exact error, if user has been found`, () => {
                getUserByMailExecutor = jest.fn().mockResolvedValue(Either.right(USER));
                const ERROR_MESSAGE = `User with email 'joe.doe@company.com' exists!`;
                emailNotExists
                  .apply(null, [userService])
                  .apply(null, [BODY])
                  .then(doer({
                    right: (): void => fail(`Right side has not been expected`),
                    left: (error: AppError) => {
                      expect(error).toBeInstanceOf(Conflict);
                      expect(error.message).toEqual(ERROR_MESSAGE);
                    }
                  }));
              });

              it(`Should return Either with exact error, if an error`, () => {
                const ERROR_MESSAGE = `some message..`;
                getUserByMailExecutor = jest.fn().mockResolvedValue(Either.left(new AppError('', ERROR_MESSAGE)));
                emailNotExists
                  .apply(null, [userService])
                  .apply(null, [BODY])
                  .then(doer({
                    right: (): void => fail(`Right side has not been expected`),
                    left: (error: AppError) => {
                      expect(error).toBeInstanceOf(AppError);
                      expect(error.message).toEqual(ERROR_MESSAGE);
                    }
                  }));
              });

              it(`Should return Either with body, if user has not been found`, () => {
                getUserByMailExecutor = jest.fn().mockResolvedValue(Either.left(new NotFound('')));
                emailNotExists
                  .apply(null, [userService])
                  .apply(null, [BODY])
                  .then(doer({
                    right: (body: UserBody) => {
                      expect(body).toBeObject;
                      expect(body).toStrictEqual(BODY);
                    },
                    left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
                  }));
              });
            });
          });
        });
      });
    });
  });
});
