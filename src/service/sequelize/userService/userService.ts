import getUserById from './getUserById/getUserById';
import getUserByEmail from './getUserByEmail/getUserByEmail';
import getUsers from './getUsers/getUsers';
import createUser from './createUser/createUser';
import updateUser from './updateUser/updateUser';
import deleteUser from './deleteUser/deleteUser';
import { SequelizeIncludes } from '../types';

export default () => {
  const includes: SequelizeIncludes = {
    include: []
  };

  return {
    getUserById: getUserById(includes),
    getUserByEmail: getUserByEmail(includes),
    getUsers: getUsers(includes),
    createUser: createUser(),
    updateUser: updateUser(includes),
    deleteUser: deleteUser()
  };
};
