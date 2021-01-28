import start from './methods/start/start';
import stop from './methods/stop/stop';
import restart from './methods/restart/restart';
import listening from './methods/listening/listening';
import { ServerFactoryParams } from '../params/factoryParams.types';

function WebServer(params: ServerFactoryParams): void {
  this.server = null;
  this.shutdownServer = null;
  this.sdkStartStop = params.service.sdkStartStop;
  this.config = params.appConfig.server;
  this.expressApp = params.expressApp;

  this.start = this.start.bind(this);
  this.stop = this.stop.bind(this);
  this.restart = this.restart.bind(this);
  this.listening = this.listening.bind(this);
}

WebServer.prototype.start = start;
WebServer.prototype.stop = stop;
WebServer.prototype.restart = restart;
WebServer.prototype.listening = listening;

export default WebServer;
