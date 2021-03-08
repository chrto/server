import optionsUnbound from './options.unbound';
import { expect as expectChai } from 'chai';
import * as Transport from 'winston-transport';
import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { LoggerOptions } from 'express-winston';
import { Maybe } from 'tsmonad';
import { TransportsDefinition } from 'logger/config/transports/transports.types';
import messageTemplate from './messageTemplate';

const CONFIG: AppConfig = {
  appLogger: {}
} as AppConfig;

const TRANSPORTS_DEFINITION: TransportsDefinition = {
  logger: [],
  exception: []
};

const getTransportsDefinition = (_appConfig: AppConfig): Maybe<TransportsDefinition> => Maybe.just(TRANSPORTS_DEFINITION);

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`middlewares`, () => {
      describe(`logger options`, () => {
        describe(`options`, () => {
          let maybeOptions: Maybe<LoggerOptions>;

          beforeAll(() => {
            maybeOptions = optionsUnbound
              .apply(null, [getTransportsDefinition, messageTemplate])
              (CONFIG);
          });
          it(`Should be exact 'express-winston' LoggerOptions object`, () => {
            maybeOptions
              .do({
                just: (loggerOptions: LoggerOptions): void => {
                  expectChai(loggerOptions)
                    .to.be.an('object');
                  expectChai(loggerOptions)
                    .has.ownProperty('expressFormat')
                    .which.is.equal(false);
                  expectChai(loggerOptions)
                    .has.ownProperty('msg')
                    .which.is.an('function')
                    .which.is.equal(messageTemplate);
                  expectChai(loggerOptions)
                    .has.ownProperty('transports')
                    .which.is.an('array');
                  loggerOptions['transports'].forEach((t) => {
                    expectChai(t)
                      .to.be.instanceOf(Transport);
                  });
                },
                nothing: () => fail(`Maybe nothing has not been expected.`)
              });
          });
        });
      });
    });
  });
});
