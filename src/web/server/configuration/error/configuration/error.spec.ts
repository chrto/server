import { expect as expectChai } from 'chai';
import { AppError } from 'common/error';
import InvalidConfiguraton, { ERROR_CODE } from './error';

describe('', () => {
  const ERR_MESSAGE = 'Configuration not loaded';
  const err = new InvalidConfiguraton(ERR_MESSAGE);
  it('InvalidConfiguraton extends Error', () => {
    expectChai(err)
      .to.be.instanceOf(AppError)
      .and.to.be.instanceOf(InvalidConfiguraton);
  });

  it('Should have proper code', () => {
    expectChai(err.code)
      .to.be.an('string')
      .which.is.equal(ERROR_CODE);
  });

  it('Should have proper message', () => {
    expectChai(err.message)
      .to.be.an('string')
      .which.is.equal(ERR_MESSAGE);
  });
});
