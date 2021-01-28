import serverStopExecutorUbound from './serverStopExecutor.ubound';
import { Server } from 'http';
import { Logger } from 'winston';
import { Fcn } from 'common/types';

type ResolveMockType = jest.Mock<void, [Server]>;
type RejectMockType = jest.Mock<void, [any]>;

const MESSAGE = 'server listener has been closed';

describe('Server Factory', () => {
  describe('Server stop executor', () => {
    let mockLogger: Logger = {} as Logger;
    let mockResolve: ResolveMockType;
    let mockReject: RejectMockType;
    let closeServer: jest.Mock<Server, [Fcn<[Error], void>]>;
    let server: Server = {} as Server;

    beforeAll(() => {
      mockLogger.info = jest.fn().mockImplementation((_message: string): Logger => mockLogger);
      mockResolve = jest.fn().mockImplementation((_server: Server) => null);
      mockReject = jest.fn().mockImplementation((_reason: any) => null);
    });

    describe('Happy path', () => {
      beforeAll(() => {
        closeServer = jest.fn().mockImplementation((cb: Fcn<[Error], void>) => {
          cb(undefined);
          return server;
        });
        server.close = closeServer;

        serverStopExecutorUbound
          .apply(null, [mockLogger, MESSAGE])
          .apply(null, [server])
          .apply(null, [mockResolve, mockReject]);
      });

      it(`Should close server listener`, () => {
        expect(closeServer)
          .toHaveBeenCalledTimes(1);
        expect(closeServer)
          .toHaveBeenCalledWith(expect.toBeFunction());
      });

      it(`Shuld resolve with void, after server listener has been closed`, () => {
        expect(mockResolve)
          .toHaveBeenCalledTimes(1);
        expect(mockResolve)
          .toHaveBeenCalledWith();
        expect(mockResolve)
          .toHaveBeenCalledAfter(closeServer);
        expect(mockReject)
          .toHaveBeenCalledTimes(0);
      });

      it(`Shuld log exact message, before promise has been resolved`, () => {
        expect(mockLogger.info)
          .toHaveBeenCalledTimes(1);
        expect(mockLogger.info)
          .toHaveBeenNthCalledWith(1, MESSAGE);
        expect(mockLogger.info)
          .toHaveBeenCalledBefore(mockResolve);
      });
    });

    describe('Error path', () => {
      const LISTENER_ERROR: Error = new Error('SERVER LISTENER ERROR');

      beforeAll(() => {
        jest.clearAllMocks();
        closeServer = jest.fn().mockImplementation((cb: Fcn<[Error], void>) => {
          cb(LISTENER_ERROR);
        });
        server.close = closeServer;

        serverStopExecutorUbound
          .apply(null, [mockLogger, MESSAGE])
          .apply(null, [server])
          .apply(null, [mockResolve, mockReject]);
      });

      it(`Should try close server listener`, () => {
        expect(closeServer)
          .toHaveBeenCalledTimes(1);
        expect(closeServer)
          .toHaveBeenCalledWith(expect.toBeFunction());
      });

      it(`Should reject with exact error, if server listener has not been closed`, () => {
        expect(mockReject)
          .toHaveBeenCalledTimes(1);
        expect(mockReject)
          .toHaveBeenCalledWith(LISTENER_ERROR);
        expect(mockResolve)
          .toHaveBeenCalledTimes(0);
        expect(mockResolve)
          .toHaveBeenCalledAfter(closeServer);
      });
    });
  });
});
