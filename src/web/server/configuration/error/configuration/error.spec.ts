import { AppError } from 'common/error';
import InvalidConfiguraton, { ERROR_CODE } from './error';

describe('', () => {
  const ERR_MESSAGE = 'Configuration not loaded';
  const err = new InvalidConfiguraton(ERR_MESSAGE);
  it('InvalidConfiguraton extends Error', () => {
    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(InvalidConfiguraton);
  });

  it('Should have proper code', () => {
    expect(err.code).toBeString;
    expect(err.code).toBe(ERROR_CODE);
  });

  it('Should have proper message', () => {
    expect(err.message).toBeString;
    expect(err.message).toBe(ERR_MESSAGE);
  });
});
