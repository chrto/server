import serverFactoryUnbound from './serverFactory.unbound';
import { Logger } from 'winston';
import { ServerFactoryParams } from '../params/factoryParams.types';
import { WebServer } from 'web/server/types';

const PARAMS: ServerFactoryParams = {
  service: {
    sdkStartStop: null
  },
  appConfig: {
    server: null
  },
  expressApp: null
} as ServerFactoryParams;

describe('Server Factory', () => {
  let logger: Logger = {} as Logger;
  let Server: jest.Mock<void, [ServerFactoryParams]>;
  let webServer: WebServer;

  beforeAll(() => {
    jest.clearAllMocks();
    logger.debug = jest.fn().mockReturnThis();
    Server = jest.fn().mockImplementation(function (params: ServerFactoryParams): void {
      this.server = null;
      this.shutdownServer = null;
      this.sdkStartStop = params.service.sdkStartStop;
      this.config = params.appConfig.server;
      this.expressApp = params.expressApp;

      this.start = this.start.bind(this);
      this.stop = this.stop.bind(this);
      this.restart = this.restart.bind(this);
      this.listening = this.listening.bind(this);
    });

    Server.prototype.start = jest.fn().mockResolvedValue(Server);
    Server.prototype.stop = jest.fn().mockResolvedValue(null);
    Server.prototype.restart = jest.fn().mockResolvedValue(null);
    Server.prototype.listening = jest.fn().mockResolvedValue(true);

    webServer = serverFactoryUnbound
      .apply(null, [Server])
      .apply(null, [PARAMS]);
  });

  describe('Happy path', () => {
    it(`Should call 'Server' constructor with exact parameters`, () => {
      expect(Server).toHaveBeenCalledTimes(1);
      expect(Server).toHaveBeenCalledWith(PARAMS);
    });

    it(`Should create new instance of Server`, () => {
      expect(webServer).toBeInstanceOf(Server);
    });
  });
});
