import { UserService } from 'service/sequelize/userService';
import { Either } from 'tsmonad';
import { AppRequest } from 'web/serverModules/types';
import { Context as PortalContext } from './../../../context/context.types';
import { UserBody } from './updateUser.types';
import { User as PortalUser } from 'model/sequelize/user/user';
import { AppError } from 'common/error';
import { asyncBind, bind, eitherify, lift, tap, tapLeft } from 'utils/either';
import { Fcn } from 'common/types';
import { Model } from 'sequelize/types';
import { Response } from 'express';
import authorizationValidator from './validator/authorizationValidator';
import { RequestImplicits } from '../../../paramHandlers/paramHandlers.types';

// const modifyUser = (user: PortalUser, loggedInUser: PortalUser) =>
//   (body: UserBody): Either<AppError, UserItems> =>
//     Either.right<AppError, PortalUser>(user)
//       .lift(sanitizeEntity)
//       .bind(changeKey('active', body, isDifferentUser.bind(null, loggedInUser), new NotAuthorized('User cannot activate/deactivate himself')))
//       .bind(changeKey('role', body, isDifferentUser.bind(null, loggedInUser), new NotAuthorized('User cannot change his role')))
//       .bind(changeKey('firstName', body))
//       .bind(changeKey('lastName', body));

// const changeKey = <BODY, I extends BODY, KB extends keyof BODY>(key: KB, body: BODY, predicate?: Predicate<I>, authorizationError?: NotAuthorized) =>
//   (user: I): Either<AppError, I> =>
//     !isMissing(authorizationError) && user[key] !== body[key]
//       ? Either.right<AppError, I>(user)
//         .bind(makeSure(predicate, authorizationError))
//         .lift(updateUserObject(key, body))
//       : Either.right<AppError, I>(user);

// const updateUserObject = <BODY, I extends BODY, KB extends keyof BODY>(key: KB, body: BODY) =>
//   (user: I): I =>
//     ({ ...user, [key]: body[key] || user[key] });

// const modifyUser = (user: PortalUser) =>
//   (body: UserBody): PortalUser =>
//     user.set(body)

const setModel = (user: PortalUser) => (body: UserBody) => user.set(body);

export default (
  bodyValidator: Fcn<[UserBody], Either<AppError, UserBody>>,
  sanitizeEntity: Fcn<[Model<PortalUser>], any>
) =>
  ({ updateUser }: UserService) =>
    async (ctx: PortalContext, req: AppRequest<unknown, UserBody, PortalUser, RequestImplicits>, _res: Response): Promise<Either<AppError, PortalUser>> =>
      Promise.resolve(Either.right<AppError, UserBody>(req.body))
        .then(bind(bodyValidator))
        .then(bind(authorizationValidator(ctx.implicits.user, ctx.loggedInUser)))
        .then(bind(eitherify(setModel(ctx.implicits.user))))
        .then(asyncBind(updateUser()))
        .then(lift(sanitizeEntity));
