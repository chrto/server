import startUnbound from './start.unbound';
import { PromiseConst } from 'common/types';
import { Server } from 'http';
import { Express } from 'express';
import { ListeningAction, RestartAction, StopAction, WebServer } from 'web/server/types';

const SHUTDOWN_APP: Express = {
  mountpath: '/shutdown'
} as Express;
const APP: Express = {
  mountpath: '/'
} as Express;
const SHUTDOWN_SERVER: Server = {
  keepAliveTimeout: 10
} as Server;
const SERVER: Server = {
  keepAliveTimeout: 100
} as Server;

describe('Server Factory', () => {
  describe('Server start method', () => {
    let retry: jest.Mock<Promise<void>, [jest.Mock<Promise<void>, []>, number, number]>;
    let startServer: jest.Mock<PromiseConst<Server>, [Express]>;
    let serverStartExecutor: jest.Mock<jest.Mock<PromiseConst<Server>, [Express]>, [number, string]>;
    let shutdownListener: jest.Mock<Express, [StopAction, RestartAction, ListeningAction]>;
    let startSDK: jest.Mock<Promise<void>, []>;
    let start: jest.Mock<WebServer, []>;
    let stop: jest.Mock<void, []>;
    let restart: jest.Mock<void, []>;
    let listening: jest.Mock<boolean, []>;
    let self;

    beforeAll(() => {
      retry = jest.fn().mockResolvedValue(null);
      startServer = jest.fn().mockImplementation((app: Express) => (resolve, _reject) => {
        resolve(app.mountpath === '/' ? SERVER : SHUTDOWN_SERVER);
      });
      serverStartExecutor = jest.fn().mockReturnValue(startServer);
      shutdownListener = jest.fn().mockReturnValue(SHUTDOWN_APP);
      startSDK = jest.fn().mockResolvedValue(null);
      start = jest.fn().mockResolvedValue(self);
      stop = jest.fn().mockResolvedValue(null);
      restart = jest.fn().mockResolvedValue(null);
      listening = jest.fn().mockResolvedValue(false);

      self = {
        server: null,
        shutdownServer: null,
        expressApp: APP,
        start: start,
        stop: stop,
        restart: restart,
        listening: listening,
        sdkStartStop: {
          start: startSDK
        },
        config: {
          apiPort: 8000,
          shutdownPort: 8001,
          startupDelay: 1000,
          retryCount: 10
        }
      };

      startUnbound
        .apply(null, [retry, serverStartExecutor, shutdownListener])
        .apply(self, []);
    });

    it('Should try connect to database', () => {
      expect(retry)
        .toHaveBeenCalledTimes(1);
      expect(retry)
        .toHaveBeenCalledWith(startSDK, self.config.startupDelay, self.config.retryCount);
    });

    it('Should start server listeners, after database connection has been established', () => {
      expect(serverStartExecutor)
        .toHaveBeenCalledTimes(2);
      expect(startServer)
        .toHaveBeenCalledTimes(2);

      expect(serverStartExecutor)
        .toHaveBeenCalledWith(self.config.apiPort, 'server listening');
      expect(startServer)
        .toHaveBeenCalledWith(APP);

      expect(shutdownListener)
        .toHaveBeenCalledTimes(1);
      expect(shutdownListener)
        .toHaveBeenCalledWith(stop, restart, listening);
      expect(serverStartExecutor)
        .toHaveBeenCalledWith(self.config.shutdownPort, 'shutdown server listening');
      expect(startServer)
        .toHaveBeenCalledWith(SHUTDOWN_APP);

      expect(serverStartExecutor)
        .toHaveBeenCalledAfter(retry);
    });

    it(`Should return 'WebServer' instance, after servers have been initialised`, () => {
      expect(self.server)
        .toStrictEqual(SERVER);
      expect(self.shutdownServer)
        .toStrictEqual(SHUTDOWN_SERVER);
    });
  });
});
