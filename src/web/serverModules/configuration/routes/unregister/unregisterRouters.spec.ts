import unregisterRoutes from './unregisterRouters';
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
  } as unknown as Express
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
          const result = unregisteredServer.expressApp._router.stack;
          expect(result).toBeArray;
          expect(result).toHaveLength(EXPRESSAPP_STACK.length - 3);
          expect(result).toStrictEqual([{ name: 'query' }, { name: 'expressInit' }]);
        });
        it(`Should keep all server items`, () => {
          const result = unregisteredServer.expressApp;
          expect(result).toBeObject;
          expect(result).toHaveProperty('locals', server.expressApp.locals);
        });
      });
    });
  });
});
