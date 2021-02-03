import context from './context';
import { expect as expectChai } from 'chai';
import { User as PortalUser } from 'model/sequelize/model/user/user';

import { AppRequest } from 'web/serverModules/types';
import { Context } from './context.types';

const currentUser: PortalUser = {
  id: 'f1114f5d-7a78-48f5-b1cd-516587d2bd45',
  email: 'joe.doe@company.com'
} as PortalUser;

const user: PortalUser = {
  id: 'd732c9ca-82cf-4c4c-bf8a-9b6ec9bbdecd',
  email: 'jack.black@company.com'
} as PortalUser;

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Global', () => {
      describe('context', () => {
        let request: AppRequest<unknown, unknown, PortalUser> = {
          currentUser,
          implicits: { user }
        } as AppRequest<unknown, unknown, PortalUser>;
        let portalContext: Context;

        beforeAll(() => {
          portalContext = context.apply(null, [request]);
        });
        it(`Should create an exact object, which has 'Context' interface`, () => {
          expectChai(portalContext)
            .to.be.an('object')
            .which.is.deep.equal({
              loggedInUser: currentUser,
              implicits: { user }
            });
        });
      });
    });
  });
});
