import unregisterRoutes from './unregisterRouters';
import { expect as expectChai } from 'chai';
import { WebServer } from 'web/server/types';
import { Express } from 'express';

const EXPRESSAPP_STACK: any = [
  {
    name: 'query'
  },
  {
    name: 'expressInit'
  },
  {
    name: 'router'
  },
  {
    name: 'router'
  },
  {
    name: 'router'
  }
];

const server: WebServer = {
  expressApp: {
    locals: {
      settings: {
        env: 'development'
      }
    },
    _router: {
      stack: EXPRESSAPP_STACK
    }
  } as Express
} as WebServer;

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`routes helper`, () => {
      describe(`unregister module routes with express`, () => {
        let unregisteredServer: WebServer;
        beforeAll(() => {
          unregisteredServer = unregisterRoutes(server);
        });

        it(`Should remove all router layers from server stack`, () => {
          expectChai(unregisteredServer.expressApp._router.stack)
            .to.be.an('array')
            .which.has.deep.members([{ name: 'query' }, { name: 'expressInit' }]);
        });
        it(`Should keep all server items`, () => {
          expectChai(unregisteredServer.expressApp)
            .to.be.an('object')
            .which.haveOwnProperty('locals')
            .which.is.deep.equal(server.expressApp.locals);
        });
      });
    });
  });
});
