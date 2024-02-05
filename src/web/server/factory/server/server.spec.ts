import Server from './server';
import { ServerFactoryParams } from '../params/factoryParams.types';

const PARAMS: ServerFactoryParams = {
  service: {
    sdkStartStop: null
  },
  appConfig: {
    server: null
  },
  expressApp: null
} as ServerFactoryParams;

describe('WebServer Class', () => {
  it(`Should create new WebServer instance`, () => {
    expect(new Server(PARAMS)).toBeInstanceOf(Server);
  });
});
