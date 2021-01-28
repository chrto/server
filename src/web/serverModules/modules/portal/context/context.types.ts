import { User as PortalUser } from 'model/sequelize/user/user';
import { RequestImplicits } from '../paramHandlers/paramHandlers.types';

export interface Context {
  readonly loggedInUser: PortalUser;
  readonly implicits?: RequestImplicits;
};
