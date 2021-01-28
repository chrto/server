import options from './options';
import { expect as expectChai } from 'chai';
import messageTemplate from './messageTemplate';
import * as Transport from 'winston-transport';

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`middlewares`, () => {
      describe(`logger options`, () => {
        describe(`options`, () => {
          it(`Should be exact 'express-winston' LoggerOptions object`, () => {
            expectChai(options)
              .to.be.an('object');
            expectChai(options)
              .has.ownProperty('expressFormat')
              .which.is.equal(false);
            expectChai(options)
              .has.ownProperty('msg')
              .which.is.an('function')
              .which.is.equal(messageTemplate);
            expectChai(options)
              .has.ownProperty('transports')
              .which.is.an('array');
            options['transports'].forEach((t) => {
              expectChai(t)
                .to.be.instanceOf(Transport);
            });
          });
        });
      });
    });
  });
});
