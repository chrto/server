import { AppError } from 'common/error';

export const ERROR_CODE = 'invalid.configuration';
export default class InvalidConfiguraton extends AppError {
  constructor(message: string) {
    super(ERROR_CODE, message);
  }
}
