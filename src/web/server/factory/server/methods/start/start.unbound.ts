import { Fcn, PromiseConst } from 'common/types';
import { Server } from 'http';
import { ListeningAction, RestartAction, StopAction, WebServer } from 'web/server/types';
import { Express } from 'express';
import { pipe } from 'ramda';

export default (
  retry: Fcn<[Fcn<[], Promise<void>>, number, number], Promise<void>>,
  serverStartExecutor: Fcn<[number, string], Fcn<[Express], PromiseConst<Server>>>,
  shutdownListener: Fcn<[StopAction, RestartAction, ListeningAction], Express>
) =>
  function (): Promise<WebServer> {
    return retry(this.sdkStartStop.start, this.config.startupDelay, this.config.retryCount)
      .then((): Promise<Server[]> => Promise.all([
        new Promise<Server>(serverStartExecutor(this.config.apiPort, 'server listening')(this.expressApp)),
        new Promise<Server>(pipe(
          serverStartExecutor(this.config.shutdownPort, 'shutdown server listening')
        )
          .apply(null, [shutdownListener(this.stop, this.restart, this.listening)])
        )
      ]))
      .then(([server, shutdownServer]: Server[]): WebServer => {
        this.server = server;
        this.shutdownServer = shutdownServer;
        return this;
      });
  };
