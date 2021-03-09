import loggerOptions from './options';
import { expect as expectChai } from 'chai';
import { LoggerOptions } from 'winston';
import { TransportsDefinition } from 'logger/config/transports/transports.types';

const TRANSPORT_DEFINITION: TransportsDefinition = {
  logger: [],
  exception: []
};

describe('Logger', () => {
  describe(`methods`, () => {
    describe(`init`, () => {
      describe(`options`, () => {
        let result: LoggerOptions;

        beforeAll(() => {
          result = loggerOptions
            .apply(null, [TRANSPORT_DEFINITION]);
        });

        it(`Should be 'LoggerOptions' object`, () => {
          expectChai(result)
            .to.be.an({}.constructor.name);
        });

        it(`Should have 'transports' item with exact transports`, () => {
          expectChai(result)
            .to.haveOwnProperty('transports')
            .which.has.deep.members(TRANSPORT_DEFINITION.logger);
        });

        it(`Should have 'exceptionHandlers' item with exact transport`, () => {
          expectChai(result)
            .and.haveOwnProperty('exceptionHandlers')
            .which.has.deep.members(TRANSPORT_DEFINITION.exception);
        });
      });
    });
  });
});
