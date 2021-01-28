import { Fcn } from 'common/types';
import { Express } from 'express';

export type StartAction = Fcn<[], Promise<WebServer>>;
export type StopAction = Fcn<[], Promise<void>>;
export type RestartAction = Fcn<[], Promise<void>>;
export type ListeningAction = Fcn<[], boolean>;
interface AsyncStartStop {
  readonly start: StartAction;
  readonly stop: StopAction;
  readonly restart: RestartAction;
  readonly listening: ListeningAction;
}

export interface WebServer extends AsyncStartStop {
  readonly expressApp: Express;
}
