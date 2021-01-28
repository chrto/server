import stopUnbound from './stop.unbound';
import { Server } from 'http';
import { PromiseConst } from 'common/types';
import { IServerConfig } from 'web/server/configuration/loader/server/serverConfig.types';
import { AppError } from 'common/error';
import { Logger } from 'winston';

const CONFIG: IServerConfig = {
  shutdownTimeout: 2000
} as IServerConfig;
const TIMEOUT: NodeJS.Timeout = {} as NodeJS.Timeout;
const SERVER: Server = {} as Server;
const SHUTDOWN_SERVER: Server = {} as Server;
const SELF = {
  config: CONFIG,
  server: SERVER,
  shutdownServer: SHUTDOWN_SERVER
};
type ActionMock = jest.Mock<void, []>;

describe('Server Factory', () => {
  describe('Server restart method', () => {
    let sdkStop: jest.Mock<Promise<void>, []>;
    let setTimeout: jest.Mock<NodeJS.Timeout, [ActionMock, number]>;
    let clearTimeout: jest.Mock<void, [NodeJS.Timeout]>;
    let logger: Logger = {} as Logger;
    let exit: jest.Mock<void, []>;

    beforeAll(() => {
      setTimeout = jest.fn().mockReturnValue(TIMEOUT);
      clearTimeout = jest.fn().mockReturnValue(null);
      logger.debug = jest.fn().mockImplementation((_message: string): Logger => logger);
      exit = jest.fn().mockImplementation(() => null);
    });

    describe('Close server listeners in correct way', () => {
      let serverStopExecutor: jest.Mock<PromiseConst<null>, [Server]>;

      beforeAll(() => {
        jest.clearAllMocks();
        sdkStop = jest.fn().mockResolvedValue(null);
        serverStopExecutor = jest.fn().mockImplementation((_server: Server) => (resolve, _reject) => {
          resolve();
        });

        stopUnbound
          .apply(null, [null, serverStopExecutor, serverStopExecutor, setTimeout, clearTimeout, null])
          .apply({
            ...SELF,
            sdkStartStop: {
              stop: sdkStop
            }
          }, []);
      });

      it(`Should set timeout for exit (hard)`, () => {
        expect(setTimeout)
          .toHaveBeenCalledTimes(1);
        expect(setTimeout)
          .toHaveBeenCalledWith(expect.toBeFunction(), SELF.config.shutdownTimeout);
      });

      it(`Should close connection to the database`, () => {
        expect(sdkStop)
          .toHaveBeenCalledTimes(1);
      });

      it(`Should close server listeners, after db connection has been closed`, () => {
        expect(serverStopExecutor)
          .toHaveBeenCalledTimes(2);
        expect(serverStopExecutor)
          .toHaveBeenNthCalledWith(1, SHUTDOWN_SERVER);
        expect(serverStopExecutor)
          .toHaveBeenNthCalledWith(2, SERVER);
        expect(serverStopExecutor)
          .toHaveBeenCalledAfter(sdkStop);
      });

      it(`Should cancel exit timeout, which had been created before shutdown chain was started`, () => {
        expect(clearTimeout)
          .toHaveBeenCalledTimes(1);
        expect(clearTimeout)
          .toHaveBeenCalledWith(TIMEOUT);
      });
    });

    describe('Exit nodeJS application, if specified timeout has been exceeded', () => {
      let serverStopExecutor: jest.Mock<PromiseConst<null>, [Server]>;

      beforeAll(() => {
        jest.clearAllMocks();
        sdkStop = jest.fn().mockResolvedValue(null);
        serverStopExecutor = jest.fn().mockImplementation((_server: Server) => (resolve, _reject) => {
          resolve();
        });
        setTimeout = jest.fn().mockImplementation((handler: () => void, _timeout?: number) => {
          handler();
          return TIMEOUT;
        });
        stopUnbound
          .apply(null, [logger, serverStopExecutor, serverStopExecutor, setTimeout, clearTimeout, exit])
          .apply({
            ...SELF,
            sdkStartStop: {
              stop: sdkStop
            }
          }, []);
      });

      it(`Should log exact message, after timeout has been reached`, () => {
        expect(logger.debug)
          .toHaveBeenCalledTimes(1);
        expect(logger.debug)
          .toHaveBeenCalledWith('shutdown timeout reached - exiting application');
      });

      it(`Should exit nodeJS application, if timeout has been exceeded`, () => {
        expect(exit)
          .toHaveBeenCalledTimes(1);
      });
    });

    describe('Exit nodeJS application, if listeners has not been closed for some reason', () => {
      const error = new AppError('error', 'Connection to the database has not been closed');

      beforeAll(() => {
        jest.clearAllMocks();
        setTimeout = jest.fn().mockReturnValue(TIMEOUT);
        sdkStop = jest.fn().mockRejectedValue(error);
        stopUnbound
          .apply(null, [logger, null, null, setTimeout, clearTimeout, exit])
          .apply({
            ...SELF,
            sdkStartStop: {
              stop: sdkStop
            }
          }, []);
      });

      it(`Should not close connection to the database`, () => {
        expect(sdkStop)
          .toHaveBeenCalledTimes(1);
      });

      it(`Should cancel timeout, which had been created before shutdown chain was started`, () => {
        expect(clearTimeout)
          .toHaveBeenCalledTimes(1);
        expect(clearTimeout)
          .toHaveBeenCalledWith(TIMEOUT);
      });

      it(`Should log exact message, after timeout has been canceled`, () => {
        expect(logger.debug)
          .toHaveBeenCalledTimes(4);
        expect(logger.debug)
          .toHaveBeenNthCalledWith(1, 'Can not close server listeners!');
        expect(logger.debug)
          .toHaveBeenNthCalledWith(2, 'exiting application...');
        expect(logger.debug)
          .toHaveBeenNthCalledWith(3, 'reason:');
        expect(logger.debug)
          .toHaveBeenNthCalledWith(4, error);
        expect(logger.debug)
          .toHaveBeenCalledAfter(clearTimeout);
      });

      it(`Should exit nodeJS application finally`, () => {
        expect(exit)
          .toHaveBeenCalledTimes(1);
        expect(exit)
          .toHaveBeenCalledWith();
      });
    });
  });
});
