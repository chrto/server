import { User } from 'model/sequelize/user/user';
import { isMissing } from 'utils/validation';

export default (user: User): boolean =>
  isMissing(user)
    ? false
    : user.isAdmin;
