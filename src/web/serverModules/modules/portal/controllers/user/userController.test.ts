it('TODO', () => undefined);

// import { expect as expectChai } from 'chai';
// import { AppError } from 'common/error';
// import { InternalServerError, NotAuthorized, NotFound, Conflict } from 'common/httpErrors';
// import { Response } from 'express';
// import { TransactionContext } from 'model/sequelize/modelFactory/pluginSdkModel.types';
// import initUserModel, { User } from 'model/sequelize/user/user';
// import { UserRequired } from 'model/sequelize/user/user.types';
// import { Order, Sequelize, WhereOptions } from 'sequelize';
// import PluginSdkService from 'service/pluginSdkService';
// import { sanitizeEntity } from 'service/sqlite/common/modelHelper';
// import { UserService } from 'service/sqlite/userService';
// import { DEFAULT_DB_DIALECT } from 'src/defaults';
// import { checkArrayResult, checkObjectResult, eitherLeftErrorHandler, eitherRightErrorHandler } from 'src/utils-test/helpers';
// import fakeData, { admin_01, user_01 } from 'src/utils-test/sequelize/data.test-helper';
// import { buildModel, buildModels, findByOptions, findOneByOptions } from 'src/utils-test/sequelize/mock.test-helper';
// import { instance, mock, resetCalls, spy, when } from 'ts-mockito';
// import { Either } from 'tsmonad';
// import { bind, lift, valueOrError } from 'utils/either';
// import { AppRequest } from 'web/common/types';
// import Context from '../../common/portalContext';
// import { DeletedUser, UserBodyPOST } from './types';
// import UserController from './userController';

// describe(`Test 'userController' module`, () => {
//   let userController = undefined;
//   let mockedUserService: UserService = undefined;
//   let service: PluginSdkService = undefined;
//   let spiedResponse: Response = undefined;
//   let req: AppRequest<unknown, unknown, User> = undefined;
//   let res: Response = undefined;
//   let currentUser: User = undefined;
//   let user: User = undefined;
//   let sequelize: Sequelize = undefined;

//   beforeAll(() => {
//     sequelize = new Sequelize(null, null, null, { dialect: DEFAULT_DB_DIALECT });
//     initUserModel(sequelize);

//     res = {
//       status: (_code: number): Response => res
//     } as Response;

//     mockedUserService = mock(UserService);

//     service = { userService: instance(mockedUserService) } as PluginSdkService;
//     userController = UserController(service);
//     spiedResponse = spy(res);
//   });

//   beforeEach(() => {
//     currentUser = buildModel(User)(admin_01);
//     user = buildModel(User)(user_01);
//     req = {
//       implicits: {
//         user
//       },
//       currentUser
//     } as AppRequest<unknown, unknown, User>;

//     resetCalls(mockedUserService);
//     resetCalls(spiedResponse);
//   });

//   describe(`Test 'getLoggedInUser'`, () => {
//     it(`should retrun logged in user object`, async () => {
//       (await userController.getLoggedInUser(Context.create(req), req, res))
//         .do({
//           right: checkObjectResult<User>(sanitizeEntity<User>(currentUser)),
//           left: eitherLeftErrorHandler()
//         });
//     });
//   });

//   describe(`Test 'getUserById'`, () => {
//     it(`should retrun user object from context`, async () => {
//       (await userController.getUserById(Context.create(req), req, res))
//         .do({
//           right: checkObjectResult<User>(sanitizeEntity<User>(user)),
//           left: eitherLeftErrorHandler()
//         });
//     });
//   });

//   describe(`Test 'deleteUser'`, () => {
//     beforeAll(() => {
//       when(mockedUserService.deleteUser()).thenCall(
//         (_context?: TransactionContext) =>
//           (user: User): Promise<Either<AppError, number>> =>
//             !user.id
//               ? Promise.resolve(Either.left<AppError, number>(new InternalServerError()))
//               : user.id === user.id
//                 ? Promise.resolve(Either.right<AppError, number>(1))
//                 : Promise.resolve(Either.left<AppError, number>(new NotFound(`Cannot find user identified by id '${user.id}'`)))
//       );
//     });

//     it(`should delete user, if everything pass well`, async () => {
//       (await userController.deleteUser(Context.create(req), req, res))
//         .do({
//           right: checkObjectResult<DeletedUser>({ removedUserId: user.id }),
//           left: eitherLeftErrorHandler()
//         });
//     });

//     it(`should not delete him self`, async () => {
//       const req: AppRequest<unknown, unknown, User> = {
//         implicits: {
//           user: currentUser
//         },
//         currentUser
//       } as AppRequest<unknown, unknown, User>;

//       (await userController.deleteUser(Context.create(req), req, res))
//         .do({
//           right: eitherRightErrorHandler('Value was not expected.'),
//           left: (error: AppError) => {
//             expectChai(error)
//               .to.be.an('error')
//               .that.is.instanceOf(NotAuthorized);
//           }
//         });
//     });
//   });

//   // describe(`Test 'updateUser'`, () => {
//   //   beforeAll(() => {
//   //     when(mockedUserService.updateUser()).thenCall(
//   //       (_context?: TransactionContext) =>
//   //         (user: User): Promise<Either<AppError, User>> =>
//   //           !user.id
//   //             ? Promise.resolve(Either.left<AppError, User>(new InternalServerError()))
//   //             : user.id === user.id
//   //               ? Promise.resolve(Either.right<AppError, User>(user))
//   //               : Promise.resolve(Either.left<AppError, User>(new NotFound(`Cannot find user identified by id '${user.id}'`)))
//   //     );
//   //   });
//   //   it(`should update user object, if everything pass well`, async () => {
//   //     const reqUpdate: AppRequest<unknown, UserBodyPATCH, User> = { ...req, body: { role: UserRole.Admin } } as AppRequest<unknown, UserBodyPATCH, User>;
//   //     (await userController.updateUser(Context.create(reqUpdate), reqUpdate, res))
//   //       .do({
//   //         right: checkObjectResult<User>({ ...sanitizeEntity<User>(user), role: UserRole.Admin }),
//   //         left: eitherLeftErrorHandler()
//   //       });
//   //   });
//   // });

//   describe(`Test 'getUsers'`, () => {
//     beforeAll(() => {
//       when(mockedUserService.getUsers()).thenCall(
//         (_context?: TransactionContext) =>
//           (where?: WhereOptions, order?: Order): Promise<Either<AppError, User[]>> =>
//             Promise.resolve(Either.right<AppError, User[]>(findByOptions(fakeData[User.tableName], { where, order })))
//               .then(lift(buildModels(User)))
//       );
//     });
//     it(`should return all user in database`, async () => {
//       (await userController.getUsers(Context.create(req), req, res))
//         .do({
//           right: checkArrayResult<User>(fakeData[User.tableName]),
//           left: eitherLeftErrorHandler()
//         });
//     });
//   });

//   describe(`Test 'createUser'`, () => {
//     // const EMAIL_REGISTERED = 'joe.doe@system4u.com';

//     // const reqCreate: AppRequest<unknown, UserBodyPOST, User> = { ...req, body: { email: EMAIL_REGISTERED, firstName: 'Joe', lastName: 'Doe' } } as AppRequest<unknown, UserBodyPOST, User>;

//     beforeAll(() => {
//       when(mockedUserService.getUserByEmail()).thenCall(
//         (_context?: TransactionContext) =>
//           (email: string): Promise<Either<AppError, User>> =>
//             Promise.resolve(Either.right<AppError, User>(findOneByOptions<User>(fakeData[User.tableName], { where: { email } })))
//               .then(bind(valueOrError(new NotFound(`Cannot find user identified by email address '${email}'`))))
//       );
//       when(mockedUserService.createUser()).thenCall(
//         (_context?: TransactionContext) =>
//           (userReq: UserRequired): Promise<Either<AppError, User>> =>
//             Promise.resolve(Either.right<AppError, User>(buildModel(User)(userReq)))
//       );
//     });
//     // it(`should create user, if not exists`, async () => {
//     //   (await userController.createUser(Context.create(reqCreate), reqCreate, res))
//     //     .do({
//     //       right: (result: User) => {
//     //         expectChai(result)
//     //           .to.be.an('object')
//     //           .which.is.deep.equal({
//     //             ...buildUserRecord({
//     //               firstName: reqCreate.body.firstName,
//     //               lastName: reqCreate.body.lastName,
//     //               email: reqCreate.body.email
//     //             }, UserRole.User),
//     //             id: result.id
//     //           });
//     //       },
//     //       left: eitherLeftErrorHandler()
//     //     });
//     // });

//     it(`should not create user, if exists`, async () => {
//       const reqCreate: AppRequest<unknown, UserBodyPOST, User> = { ...req, body: { email: user_01.email } } as AppRequest<unknown, UserBodyPOST, User>;
//       (await userController.createUser(Context.create(reqCreate), reqCreate, res))
//         .do({
//           right: eitherRightErrorHandler('Value was not expected.'),
//           left: (error: AppError) => {
//             expectChai(error)
//               .to.be.an('error')
//               .that.is.instanceOf(Conflict);
//           }
//         });
//     });

//     // it(`response status should be set to code '201'.`, async () => {
//     //   (await userController.createUser(Context.create(reqCreate), reqCreate, res))
//     //     .do({
//     //       right: (_result: User) => {
//     //         verify(spiedResponse.status(201)).once();
//     //       },
//     //       left: eitherLeftErrorHandler()
//     //     });
//     // });
//   });
// });
