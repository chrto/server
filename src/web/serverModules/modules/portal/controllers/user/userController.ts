import getUserById from './getUserById/getUserById';

import { AppError } from 'common/error';
import { Response } from 'express';
import { User as PortalUser } from 'model/sequelize/user/user';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { sanitizeEntity } from 'service/sequelize/common/modelHelper';
import { Either } from 'tsmonad';
import { asyncBind, bind, lift } from 'utils/either';
import { AppRequest } from 'web/serverModules/types';

import { Context as PortalContext } from './../../context/context.types';
import userBodyValidatorPOST from './userBodyValidatorPOST';
import { buildUser, validateEmailNotExists } from './helpers';
import { UserBodyPOST } from './types';
import deleteUser from './deleteUser/deleteUser';
import updateUser from './updateUser/updateUser';
import getUsers from './getUsers/getUsers';

export default ({ userService }: PluginSdkService) =>
({
  getUserById,
  deleteUser,
  updateUser: updateUser(userService),
  getUsers: getUsers(userService),

  createUser:
    async (_ctx: PortalContext, req: AppRequest<unknown, UserBodyPOST, PortalUser>, res: Response): Promise<Either<AppError, PortalUser>> =>
      Promise.resolve(Either.right<AppError, UserBodyPOST>(req.body))
        .then(bind(userBodyValidatorPOST))
        .then(asyncBind(validateEmailNotExists(userService)))
        .then(bind(buildUser))
        .then(asyncBind(userService.createUser()))
        .then(lift((user: PortalUser): PortalUser => res.status(201) && sanitizeEntity(user)))
});
