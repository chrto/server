import { AppError } from 'common/error';
import { UserRole } from 'model/sequelize/user/user.types';
import { Either } from 'tsmonad';
import { isBoolean, isMissing } from 'utils/validation';
import bodyValidator, { check } from 'utils/object/validator/properties/properties';
import { Validator } from 'utils/object/validator/properties/properties.types';
import { UserBody } from '../updateUser.types';

const BODY_CHECK: Validator<UserBody>[] = [
  check(body => isMissing(body.role) ? true : (body.role in UserRole), 'Invalid user role'),
  check(body => isMissing(body.active) ? true : isBoolean(body.active), `'active' parameter must be boolean`)
];

export default (body: UserBody): Either<AppError, UserBody> =>
  Either.right<AppError, UserBody>(body)
    .bind(bodyValidator(BODY_CHECK));
