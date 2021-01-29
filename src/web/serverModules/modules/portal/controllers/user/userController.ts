import getUserById from './getUserById/getUserById';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import deleteUser from './deleteUser/deleteUser';
import updateUser from './updateUser/updateUser';
import getUsers from './getUsers/getUsers';
import createUser from './createUser/createUser';

export default ({ userService }: PluginSdkService) =>
({
  getUserById,
  deleteUser,
  updateUser: updateUser(userService),
  getUsers: getUsers(userService),
  createUser: createUser(userService)
});
