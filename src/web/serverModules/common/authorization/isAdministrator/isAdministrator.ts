import { Maybe } from 'tsmonad';
import isAdmin from '../validators/isAdmin/isAdmin';

export default <CTX>(ctx: CTX): Maybe<string> =>
  isAdmin(ctx['loggedInUser'])
    ? Maybe.nothing()
    : Maybe.just('Only an administator is authorized to fulfill this action');
