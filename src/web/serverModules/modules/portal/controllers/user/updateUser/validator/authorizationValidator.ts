import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { isMissing } from 'utils/validation';
import authValidator, { check } from 'utils/object/validator/properties/properties';
import { Validator } from 'utils/object/validator/properties/properties.types';
import { UserBody } from '../updateUser.types';
import { User as PortalUser } from 'model/sequelize/model/user/user';
import isDifferentUser from 'web/serverModules/common/authorization/validators/differentEntity/differentEntity';
import { NotAuthorized } from 'common/httpErrors';

const authChecks = (user: PortalUser, currentUser: PortalUser): Validator<UserBody>[] => ([
  check(body => isMissing(body.active) || body.active === user.active || isDifferentUser(user, currentUser), 'User cannot activate/deactivate himself'),
  check(body => isMissing(body.role) || body.role === user.role || isDifferentUser(user, currentUser), 'User cannot change his role')
]);

export default (user: PortalUser, currentUser: PortalUser) =>
(body: UserBody): Either<AppError, UserBody> =>
  Either.right<AppError, UserBody>(body)
    .bind(authValidator(authChecks(user, currentUser), NotAuthorized));
