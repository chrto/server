import { Maybe } from 'tsmonad';

type AuthorizationHandler = <CTX>(context: CTX) => Maybe<string>;

export interface AuthorizationHandlers {
  allAuthenticated: AuthorizationHandler;
  isAdministrator: AuthorizationHandler;
}
