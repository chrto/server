import sameEntity from 'web/serverModules/common/authorization/validators/sameEntity/sameEntity';
import { User as PortalUser } from 'model/sequelize/user/user';
import { UserBodyPOST } from './types';
import { Either } from 'tsmonad';
import { Conflict, NotFound } from 'common/httpErrors';
import { caseOf } from 'utils/either';
import { UserService } from 'service/sequelize/userService';
import { AppError } from 'common/error';
import userFactory from 'model/sequelize/user/factory/userFactory';

export const notSameUser = (loggedInUser: PortalUser) =>
  (user: PortalUser): boolean => !sameEntity<string>(loggedInUser, user);

export const validateEmailNotExists = (userService: UserService) =>
  (body: UserBodyPOST): Promise<Either<AppError, UserBodyPOST>> =>
    userService.getUserByEmail()(body.email)
      .then(caseOf({
        right: (_user: PortalUser) => Either.left<AppError, UserBodyPOST>(new Conflict(`User with email '${body.email}' exists!`)),
        left: (error: AppError) => error instanceof NotFound ? Either.right<AppError, UserBodyPOST>(body) : Either.left<AppError, UserBodyPOST>(error)
      }));

export const buildUser = (body: UserBodyPOST) =>
  userFactory(body);
