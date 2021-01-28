import { AppError } from 'common/error';
import { InvalidInput } from 'common/httpErrors';
import { Either } from 'tsmonad';

export function parseNumber(numericText: string, error?: AppError): Either<AppError, number> {
  let num = parseInt(numericText);

  return isNaN(num)
    ? Either.left<AppError, number>(error || new InvalidInput(`Cannot convert '${numericText}' to number`))
    : Either.right(num);
}

export function parseJSON(jsonString: string, error?: AppError): Either<AppError, any> {
  try {
    return Either.right(JSON.parse(jsonString));
  } catch (e) {
    return Either.left(error || new InvalidInput(`Cannot parse JSON: ${e.message}`));
  }
}
