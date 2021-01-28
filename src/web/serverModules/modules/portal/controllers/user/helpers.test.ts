it('TODO', () => undefined);

// import { expect } from 'chai';
// import { notSameUser, modifyUser, validateEmailNotExists } from './helpers';
// import { User as PortalUser } from 'model/sequelize/user/user';
// import { UserBodyPATCH, UserBodyPOST } from './types';
// import { eitherLeftErrorHandler, eitherRightErrorHandler } from 'src/utils-test/helpers';
// import { NotAuthorized, Conflict, NotFound, InternalServerError } from 'common/httpErrors';
// import { mock, when, resetCalls, instance } from 'ts-mockito';
// import UserService from 'service/sqlite/userService';
// import { Either } from 'tsmonad';
// import { AppError } from 'common/error';
// import { UserRole } from 'model/sequelize/user/user.types';
// import { TransactionContext } from 'model/sequelize/modelFactory/pluginSdkModel.types';

// const EMAIL_REGISTERED = 'name.surname@system4u.com';
// const EMAIL_NOT_REGISTERED = 'name.surname@company.com';

// const loggedInAdmin: PortalUser = {
//   id: '70f38451-334b-4583-85c8-3abc507e67d9',
//   active: true,
//   role: UserRole.Admin,
//   get isAdmin(): boolean {
//     return this.role === UserRole.Admin;
//   }
// } as PortalUser;

// const loggedInUser: PortalUser = {
//   id: '70f38451-334b-4583-85c8-3abc507e67d9',
//   active: true,
//   role: UserRole.User,
//   get isAdmin(): boolean {
//     return this.role === UserRole.Admin;
//   }
// } as PortalUser;

// const user: PortalUser = {
//   id: 'dbb871d3-95ed-4187-b17f-ae15a25ef7ef',
//   active: true,
//   role: UserRole.User
// } as PortalUser;

// const bodyPatch: UserBodyPATCH = {
//   active: true,
//   role: UserRole.Admin
// };

// const bodyPost: UserBodyPOST = {
//   email: 'joe.doe@company.com',
//   firstName: 'Joe',
//   lastName: 'Doe'
// };

// describe(`Test 'userController helpers' module`, () => {
//   describe(`Test 'notSameUser' function`, () => {
//     it(`should return 'true', if not same user`, () => {
//       expect(notSameUser(loggedInUser)(user))
//         .to.be.an('boolean')
//         .which.is.equal(true);
//     });

//     it(`should return 'false', if same user`, () => {
//       expect(notSameUser(loggedInUser)(loggedInUser))
//         .to.be.an('boolean')
//         .which.is.equal(false);
//     });
//   });

//   describe(`Test 'modifyUser' function`, () => {
//     it(`should modify user model with values from body`, () => {
//       modifyUser(user, loggedInAdmin)({ ...bodyPatch, active: false, role: UserRole.User })
//         .do({
//           right: (actual: PortalUser) => {
//             expect(actual)
//               .to.be.an('object')
//               .which.is.deep.equals({ ...user, ...bodyPatch, active: false, role: UserRole.User });
//           },
//           left: eitherLeftErrorHandler()
//         });
//     });

//     it(`only admin can update user.`, () => {
//       modifyUser(user, loggedInUser)(bodyPatch)
//         .do({
//           right: eitherRightErrorHandler('Value was not expected.'),
//           left: (error: AppError) => {
//             expect(error)
//               .to.be.an('error')
//               .that.is.instanceOf(NotAuthorized);
//           }
//         });
//     });

//     it(`user can not activate/deactivate him self.`, () => {
//       modifyUser(loggedInAdmin, loggedInAdmin)({ ...bodyPatch, active: !bodyPatch.active })
//         .do({
//           right: eitherRightErrorHandler('Value was not expected.'),
//           left: (error: AppError) => {
//             expect(error)
//               .to.be.an('error')
//               .that.is.instanceOf(NotAuthorized);
//           }
//         });
//     });

//     it(`user can not change role him self.`, () => {
//       modifyUser(loggedInAdmin, loggedInAdmin)({ ...bodyPatch, role: UserRole.User })
//         .do({
//           right: eitherRightErrorHandler('Value was not expected.'),
//           left: (error: AppError) => {
//             expect(error)
//               .to.be.an('error')
//               .that.is.instanceOf(NotAuthorized);
//           }
//         });
//     });
//   });

//   describe(`Test 'validateEmailNotExists' function`, () => {
//     let mockedUserService: UserService = undefined;

//     beforeAll(() => {
//       mockedUserService = mock(UserService);
//       when(mockedUserService.getUserByEmail()).thenCall(
//         (_context?: TransactionContext) =>
//           (email: string): Promise<Either<AppError, PortalUser>> =>
//             email === EMAIL_REGISTERED
//               ? Promise.resolve(Either.right<AppError, PortalUser>(user))
//               : email === EMAIL_NOT_REGISTERED
//                 ? Promise.resolve(Either.left<AppError, PortalUser>(new NotFound(`Cannot find user identified by email address '${EMAIL_NOT_REGISTERED}'`)))
//                 : Promise.resolve(Either.left<AppError, PortalUser>(new InternalServerError()))
//       );
//     });

//     beforeEach(() => {
//       resetCalls(mockedUserService);
//     });

//     it(`should return body in right side, if email is not registerd id DB.`, async () => {
//       (await validateEmailNotExists(instance(mockedUserService))({ ...bodyPost, email: EMAIL_NOT_REGISTERED }))
//         .do({
//           right: (actual: UserBodyPOST) => {
//             expect(actual)
//               .to.be.an('object')
//               .which.is.deep.equals({ ...bodyPost, email: EMAIL_NOT_REGISTERED });
//           },
//           left: eitherLeftErrorHandler()
//         });
//     });

//     it(`should return 'Conflict' in left side, if email is registerd id DB.`, async () => {
//       (await validateEmailNotExists(instance(mockedUserService))({ ...bodyPost, email: EMAIL_REGISTERED }))
//         .do({
//           right: eitherRightErrorHandler('Value was not expected.'),
//           left: (error: AppError) => {
//             expect(error)
//               .to.be.an('error')
//               .that.is.instanceOf(Conflict);
//           }
//         });
//     });

//     it(`should return 'Error' in left side, if service failed.`, async () => {
//       (await validateEmailNotExists(instance(mockedUserService))(bodyPost))
//         .do({
//           right: eitherRightErrorHandler('Value was not expected.'),
//           left: (error: AppError) => {
//             expect(error)
//               .to.be.an('error')
//               .that.is.instanceOf(InternalServerError);
//           }
//         });
//     });
//   });

//   // describe(`Test 'buildUser' function`, () => {
//   //   it(`should update body with values from user object.`, () => {
//   //     buildUser(bodyPost)
//   //       .do({
//   //         right: (actual: UserItems) => {
//   //           expect(actual)
//   //             .to.be.an('object')
//   //             .which.is.deep.equals({ ...bodyPost, active: true, role: UserRole.User, id: actual.id });
//   //         },
//   //         left: eitherLeftErrorHandler()
//   //       });
//   //   });
//   // });
// });
