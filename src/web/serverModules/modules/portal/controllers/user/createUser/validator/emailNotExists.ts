import { AppError } from 'common/error';
import { Conflict, NotFound } from 'common/httpErrors';
import { Either } from 'tsmonad';
import { caseOf } from 'utils/either';
import { User as PortalUser } from 'model/sequelize/user/user';
import { UserService } from 'service/sequelize/userService/userService.types';
import { UserBody } from '../createUser.types';

export default ({ getUserByEmail }: Partial<UserService>) =>
  (body: UserBody): Promise<Either<AppError, UserBody>> =>
    getUserByEmail()(body.email)
      .then(caseOf({
        right: (_user: PortalUser) => Either.left<AppError, UserBody>(new Conflict(`User with email '${body.email}' exists!`)),
        left: (error: AppError) => error instanceof NotFound ? Either.right<AppError, UserBody>(body) : Either.left<AppError, UserBody>(error)
      }));
