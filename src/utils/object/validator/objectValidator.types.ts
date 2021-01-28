import { InvalidInput, NotAuthorized } from 'common/httpErrors';

export type ObjectValidatorError = typeof InvalidInput | typeof NotAuthorized;
