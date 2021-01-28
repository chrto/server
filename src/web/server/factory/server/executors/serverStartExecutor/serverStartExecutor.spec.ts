import serverStartExecutorUnbound from './serverStartExecutor.unbound';

import { Fcn } from 'common/types';
import { Server } from 'http';
import { Logger } from 'winston';
import { Express } from 'express';

type ResolveMockType = jest.Mock<void, [Server]>;

const MESSAGE: string = 'log message..';
const PORT: number = 8000;
const SERVER: Server = {} as Server;

describe('Server Factory', () => {
  describe('Server start executor', () => {
    let expressApp: Express = {} as Express;
    let logger: Logger = {} as Logger;
    let mockResolve: ResolveMockType;

    beforeAll(() => {
      expressApp.listen = jest.fn().mockImplementation((_port: number, cb: Fcn<[], void>): Server => {
        const server = SERVER;
        cb.apply(server, []);
        return server;
      });
      logger.info = jest.fn().mockImplementation((_message: string): Logger => logger);
      logger.debug = jest.fn().mockImplementation((_message: string): Logger => logger);
      mockResolve = jest.fn().mockImplementation((_server: Server) => null);

      serverStartExecutorUnbound
        .apply(null, [logger])
        .apply(null, [PORT, MESSAGE])
        .apply(null, [expressApp])
        .apply(null, [mockResolve]);
    });

    it('Should try start server listener', () => {
      expect(expressApp.listen)
        .toHaveBeenCalledTimes(1);
      expect(expressApp.listen)
        .toHaveBeenCalledWith(PORT, expect.toBeFunction());
    });

    it('Should log exact message, if server listener has been started', () => {
      expect(logger.info)
        .toHaveBeenCalledTimes(1);
      expect(logger.info)
        .toHaveBeenCalledWith(MESSAGE);
      expect(logger.debug)
        .toHaveBeenCalledTimes(1);
      expect(logger.debug)
        .toHaveBeenCalledWith(`on port ${PORT}`);
    });

    it(`Should resolve promise, if server listener has been started`, () => {
      expect(mockResolve)
        .toHaveBeenCalledTimes(1);
      expect(mockResolve)
        .toHaveBeenCalledWith(SERVER);
      expect(expressApp.listen)
        .toHaveBeenCalledBefore(mockResolve);
    });
  });
});
