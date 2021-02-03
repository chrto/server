import { Context } from './context.types';
import { ContextFactory } from 'web/serverModules/types';
import { User as PortalUser } from 'model/sequelize/model/user/user';

const contextFactory: ContextFactory<Context, PortalUser> = (req) => ({
  loggedInUser: req.currentUser,
  implicits: req.implicits
});
export default contextFactory;
