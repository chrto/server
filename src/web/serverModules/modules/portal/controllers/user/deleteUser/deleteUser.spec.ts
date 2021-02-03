import deleteUserUnbound from './deleteUser.unbound';
import { AppError } from 'common/error';
import { User } from 'model/sequelize/model/user/user';
import { Either } from 'tsmonad';
import { Context } from '../../../context/context.types';
import { DeletedUser } from './deleteUser.types';
import { NotAuthorized } from 'common/httpErrors';

type DeleteUserExecutor = jest.Mock<Promise<Either<AppError, number>>, [User]>;
const USER_MODEL: User = { id: '3a2cffc9-1fc5-4a05-87d8-8411cd4f920c' } as User;
const CURRENT_USER_MODEL: User = { id: 'f72fa53a-411c-44ed-a1b2-7d82845cc955' } as User;

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Portal', () => {
      describe('controller', () => {
        describe('user controller', () => {
          describe('delete user by id', () => {
            let differentEntity: jest.Mock<boolean, [User, User]>;
            let deleteUserExecutor: DeleteUserExecutor;
            let deleteUser: jest.Mock<DeleteUserExecutor, []>;

            let context: Context;
            let result: Either<AppError, DeletedUser>;

            beforeAll(async () => {
              context = { implicits: { user: USER_MODEL }, loggedInUser: CURRENT_USER_MODEL };
            });

            describe('Happy path', () => {
              beforeAll(async () => {
                jest.clearAllMocks();
                differentEntity = jest.fn().mockReturnValue(true);
                deleteUserExecutor = jest.fn().mockResolvedValue(Either.right(1));
                deleteUser = jest.fn().mockReturnValue(deleteUserExecutor);

                result = await deleteUserUnbound
                  .apply(null, [differentEntity])
                  .apply(null, [{ deleteUser }])
                  .apply(null, [context, null, null]);
              });
              it(`Should check, if the user does not want to delete himself`, () => {
                expect(differentEntity)
                  .toHaveBeenCalledTimes(1);
                expect(differentEntity)
                  .toHaveBeenCalledWith(CURRENT_USER_MODEL, USER_MODEL);
              });

              it(`Should delete user from DB, if user does not want to delete himself`, () => {
                expect(deleteUser)
                  .toHaveBeenCalledTimes(1);
                expect(deleteUser)
                  .toHaveBeenCalledWith();
                expect(deleteUserExecutor)
                  .toHaveBeenCalledTimes(1);
                expect(deleteUserExecutor)
                  .toHaveBeenCalledWith(USER_MODEL);
              });

              it(`Should return Either with exact object in right side`, () => {
                result.do({
                  right: (value: DeletedUser): void => {
                    expect(value)
                      .toEqual({ removedUserId: USER_MODEL.id });
                  },
                  left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
                });
              });
            });

            describe('Error path', () => {
              describe('Authorization', () => {
                beforeAll(async () => {
                  jest.clearAllMocks();
                  differentEntity = jest.fn().mockReturnValue(false);

                  result = await deleteUserUnbound
                    .apply(null, [differentEntity])
                    .apply(null, [{ deleteUser }])
                    .apply(null, [context, null, null]);
                });

                it('Should finish chain, if authorization has not been passed', () => {
                  expect(differentEntity)
                    .toHaveBeenCalledTimes(1);
                  expect(deleteUserExecutor)
                    .toHaveBeenCalledTimes(0);
                });

                it('Should return Either with exact error in left side', () => {
                  result.do({
                    right: (_value: DeletedUser): void => fail(`Right side has not been expected`),
                    left: (error: AppError) => {
                      expect(error)
                        .toBeInstanceOf(NotAuthorized);
                      expect(error.message)
                        .toEqual('User cannot delete himself');
                    }
                  });
                });
              });

              describe('Service', () => {
                const ERROR_MESSAGE: string = 'Internal server error';
                const serviceError: AppError = new AppError('service.error', ERROR_MESSAGE);

                beforeAll(async () => {
                  jest.clearAllMocks();
                  differentEntity = jest.fn().mockReturnValue(true);
                  deleteUserExecutor = jest.fn().mockResolvedValue(Either.left(serviceError));
                  deleteUser = jest.fn().mockReturnValue(deleteUserExecutor);

                  result = await deleteUserUnbound
                    .apply(null, [differentEntity])
                    .apply(null, [{ deleteUser }])
                    .apply(null, [context, null, null]);
                });

                it('Should finish chain, if authorization has not been passed', () => {
                  expect(differentEntity)
                    .toHaveBeenCalledTimes(1);
                  expect(deleteUserExecutor)
                    .toHaveBeenCalledTimes(1);
                });

                it('Should return Either with exact error in left side', () => {
                  result.do({
                    right: (_value: DeletedUser): void => fail(`Right side has not been expected`),
                    left: (error: AppError) => {
                      expect(error)
                        .toBeInstanceOf(AppError);
                      expect(error.message)
                        .toEqual(ERROR_MESSAGE);
                    }
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
