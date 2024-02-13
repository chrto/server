import loggerOptions from './options';
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
          expect(result).toBeObject;
        });

        it(`Should have 'transports' item with exact transports`, () => {
          expect(result).toHaveProperty('transports');
          expect(result.transports).toBeArray;
          expect(result.transports).toStrictEqual(expect.arrayContaining(TRANSPORT_DEFINITION.logger));
        });

        it(`Should have 'exceptionHandlers' item with exact transport`, () => {
          expect(result).toHaveProperty('exceptionHandlers');
          expect(result.transports).toBeArray;
          expect(result.transports).toStrictEqual(expect.arrayContaining(TRANSPORT_DEFINITION.exception));
        });
      });
    });
  });
});
