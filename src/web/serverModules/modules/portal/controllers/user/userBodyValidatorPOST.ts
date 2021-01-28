import bodyValidator, { check } from 'utils/object/validator/properties/properties';
import requiredProperties from 'utils/object/validator/required/requiredProperties';
import { AppError } from 'common/error';
import { UserRole } from 'model/sequelize/user/user.types';
import { Either } from 'tsmonad';
import { UserBodyPOST } from './types';
import { isBoolean, isMissing } from 'utils/validation';
import { Validator } from 'utils/object/validator/properties/properties.types';

const REQUIRED_FIELDS = ['email'];

const BODY_CHECK: Validator<UserBodyPOST>[] = [
  check(body => !isMissing(body.email), 'Missing mandatory property email'),
  check(body => isMissing(body.role) ? true : (body.role in UserRole), 'Invalid user role'),
  check(body => isMissing(body.active) ? true : isBoolean(body.active), `'active' parameter must be boolean`)
];

export default (body: UserBodyPOST): Either<AppError, UserBodyPOST> =>
  Either.right<AppError, UserBodyPOST>(body)
    .bind(requiredProperties(REQUIRED_FIELDS))
    .bind(bodyValidator(BODY_CHECK));
