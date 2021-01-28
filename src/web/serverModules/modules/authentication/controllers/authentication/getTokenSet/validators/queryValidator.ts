import requiredProperties from 'utils/object/validator/required/requiredProperties';
import { isMissing } from 'utils/validation';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { TokenQueryParams } from '../getTokenSet.types';
import { Validator } from 'utils/object/validator/properties/properties.types';
import queryValidator, { check } from 'utils/object/validator/properties/properties';

const REQUIRED_FIELDS = ['auth_code'];

const PARAM_CHECK: Validator<TokenQueryParams>[] = [
  check(query => !isMissing(query.auth_code), 'Missing mandatory query parameter: auth_code')
];

export default (query: TokenQueryParams): Either<AppError, TokenQueryParams> =>
  Either.right<AppError, TokenQueryParams>(query)
    .bind(requiredProperties(REQUIRED_FIELDS))
    .bind(queryValidator(PARAM_CHECK));
