import isAdministrator from './isAdministrator';
import { assert as assertChai, expect as expectChai } from 'chai';
import { Options, Sequelize } from 'sequelize';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';
import initUserModel, { User } from 'model/sequelize/model/user/user';
import { UserItems, UserRole } from 'model/sequelize/model/user/user.types';
import * as IsAdmin from '../validators/isAdmin/isAdmin';
import { Maybe } from 'tsmonad';

const CTX: any = {
  loggedInUser: null
};

const SEQUELIZE_CONFIG: Options = {
  dialect: EDatabaseDialect.sqlite,
  storage: null,
  logging: false,
  define: {
    timestamps: true
  }
};

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`authorization`, () => {
      describe(`only administrator access`, () => {
        let items: UserItems;
        let spiedIsAdmin: jest.SpyInstance<boolean, [User]>;
        let loggedInUser: User;
        let result: Maybe<string>;

        beforeAll(() => {
          initUserModel(new Sequelize(SEQUELIZE_CONFIG));
          spiedIsAdmin = jest.spyOn(IsAdmin, 'default');
          items = {
            id: 'f923b2c9-ffcf-4a0a-bdc9-a4a4ae2a687e',
            firstName: 'Joe',
            lastName: 'Doe',
            email: 'joe.doe@company.com',
            active: true,
            role: UserRole.Admin
          };
        });

        describe(`User has admin role`, () => {
          beforeAll(() => {
            jest.clearAllMocks();
            loggedInUser = User.build({ items, role: UserRole.Admin });
            result = isAdministrator({ ...CTX, loggedInUser });
          });

          it(`Should check, if user is administrator`, () => {
            expect(spiedIsAdmin)
              .toHaveBeenCalledTimes(1);
            expect(spiedIsAdmin)
              .toHaveBeenCalledWith(loggedInUser);
          });

          it(`Should allow access to the user, which has admin role`, () => {
            result
              .do({
                just: () =>
                  assertChai
                    .fail(null, null, 'Nothing has been expected'),
                nothing: () =>
                  assertChai.ok
              });
          });
        });

        describe(`User has not admin role`, () => {
          beforeAll(() => {
            jest.clearAllMocks();
            loggedInUser = User.build({ items, role: UserRole.User });
            result = isAdministrator({ ...CTX, loggedInUser });
          });

          it(`Should reject access to the user, which has not admin role`, () => {
            isAdministrator({ ...CTX, loggedInUser })
              .do({
                just: (message: string) =>
                  expectChai(message)
                    .to.be.an('string')
                    .which.is.equal('Only an administator is authorized to fulfill this action'),
                nothing: () =>
                  assertChai
                    .fail(null, null, 'Nothing has not been expected')
              });
          });
        });

        describe(`User is unknown object`, () => {
          beforeAll(() => {
            jest.clearAllMocks();
            loggedInUser = {} as User;
            result = isAdministrator({ ...CTX, loggedInUser });
          });

          it(`Should reject access if user is unknown object`, () => {
            isAdministrator({ ...CTX, loggedInUser })
              .do({
                just: (message: string) =>
                  expectChai(message)
                    .to.be.an('string')
                    .which.is.equal('Only an administator is authorized to fulfill this action'),
                nothing: () =>
                  assertChai
                    .fail(null, null, 'Nothing has not been expected')
              });
          });
        });

        describe(`User is null`, () => {
          beforeAll(() => {
            jest.clearAllMocks();
            loggedInUser = null;
            result = isAdministrator({ ...CTX, loggedInUser });
          });

          it(`Should reject access if user is null`, () => {
            isAdministrator({ ...CTX, loggedInUser })
              .do({
                just: (message: string) =>
                  expectChai(message)
                    .to.be.an('string')
                    .which.is.equal('Only an administator is authorized to fulfill this action'),
                nothing: () =>
                  assertChai
                    .fail(null, null, 'Nothing has not been expected')
              });
          });
        });
      });
    });
  });
});
