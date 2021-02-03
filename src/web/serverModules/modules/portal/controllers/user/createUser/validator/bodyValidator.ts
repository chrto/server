import bodyValidator, { check } from 'utils/object/validator/properties/properties';
import requiredProperties from 'utils/object/validator/required/requiredProperties';
import { AppError } from 'common/error';
import { UserRole } from 'model/sequelize/model/user/user.types';
import { Either } from 'tsmonad';
import { UserBody } from '../createUser.types';
import { isBoolean, isEnum, isMissing, isValidEmail } from 'utils/validation';
import { Validator } from 'utils/object/validator/properties/properties.types';

const REQUIRED_FIELDS = ['email', 'firstName', 'lastName'];

const BODY_CHECK: Validator<UserBody>[] = [
  check(body => !isMissing(body.email), 'Missing mandatory property email'),
  check(body => !isMissing(body.firstName), 'Missing mandatory property firstName'),
  check(body => !isMissing(body.lastName), 'Missing mandatory property lastName'),
  check(body => isMissing(body.email) || isValidEmail(body.email), `Email address is not valid`),
  check(body => isMissing(body.role) || isEnum(UserRole)(body.role), 'Invalid user role'),
  check(body => isMissing(body.active) || isBoolean(body.active), `'active' parameter must be boolean`)
];

export default (body: UserBody): Either<AppError, UserBody> =>
  Either.right<AppError, UserBody>(body)
    .bind(requiredProperties(REQUIRED_FIELDS))
    .bind(bodyValidator(BODY_CHECK));
