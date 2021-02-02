import { User as PortalUser } from 'model/sequelize/user/user';

export enum ModuleParams {
  userId = 'userId'
}
export interface RequestImplicits {
  user?: PortalUser;
}
