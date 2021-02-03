import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { UserItems, UserRequired, UserRole } from '../user.types';

export default (uuidGenrator: () => string) =>
  (userRequired: UserRequired): Either<AppError, UserItems> =>
    Either.right<AppError, UserItems>({
      id: uuidGenrator(),
      active: userRequired.hasOwnProperty('active') ? userRequired.active : true,
      role: userRequired.hasOwnProperty('role') ? userRequired.role : UserRole.User,
      ...userRequired
    });
