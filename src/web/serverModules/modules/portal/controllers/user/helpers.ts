import sameEntity from 'web/serverModules/common/authorization/validators/sameEntity/sameEntity';
import { User as PortalUser } from 'model/sequelize/user/user';
import { UserBody } from './createUser/createUser.types';
import userFactory from 'model/sequelize/user/factory/userFactory';

export const notSameUser = (loggedInUser: PortalUser) =>
  (user: PortalUser): boolean => !sameEntity<string>(loggedInUser, user);

export const buildUser = (body: UserBody) =>
  userFactory(body);
