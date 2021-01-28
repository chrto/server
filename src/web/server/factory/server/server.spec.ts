import Server from './server';
import { expect as expectChai } from 'chai';
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
    expectChai(new Server(PARAMS))
      .to.be.instanceOf(Server);
  });
});
