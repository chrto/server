import requiredProperties from 'utils/object/validator/required/requiredProperties';
import { isMissing } from 'utils/validation';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { TokenRefreshQueryParams } from '../refreshTokenSet.types';
import { Validator } from 'utils/object/validator/properties/properties.types';
import queryValidator, { check } from 'utils/object/validator/properties/properties';

const REQUIRED_FIELDS = ['refresh_token'];

const PARAM_CHECK: Validator<TokenRefreshQueryParams>[] = [
  check(body => !isMissing(body.refresh_token), 'Missing mandatory query parameter: refresh_token')
];

export default (query: TokenRefreshQueryParams): Either<AppError, TokenRefreshQueryParams> =>
  Either.right<AppError, TokenRefreshQueryParams>(query)
    .bind(requiredProperties(REQUIRED_FIELDS))
    .bind(queryValidator(PARAM_CHECK));
