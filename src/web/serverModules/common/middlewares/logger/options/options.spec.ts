import optionsUnbound from './options.unbound';
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
                  expect(loggerOptions).toBeObject;
                  expect(loggerOptions).toHaveProperty('expressFormat');
                  expect(loggerOptions.expressFormat).toBeFalse;
                  expect(loggerOptions).toHaveProperty('msg');
                  expect(loggerOptions.msg).toBeFunction;
                  expect(loggerOptions.msg).toEqual(messageTemplate);
                  expect(loggerOptions).toHaveProperty('transports');
                  expect(loggerOptions['transports']).toBeArray;

                  loggerOptions['transports'].forEach((t) => {
                    expect(t).toBeInstanceOf(Transport);
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
