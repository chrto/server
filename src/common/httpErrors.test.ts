import { AppError } from './error';

import {
  BadRequest,
  Conflict,
  InvalidInput,
  NotAuthenticated,
  NotAuthorized,
  NotFound
} from './httpErrors';

describe('Common/Types tests', () => {
  it('NotFound extends Error', () => {
    let err = new NotFound('Not Found');

    expect(err).toBeInstanceOf(NotFound);
    expect(err.message).toBe('Not Found');
    expect(err.code).toBe('not.found');
  });

  it('InvalidInput extends Error', () => {
    let err = new InvalidInput('Invalid Input');

    expect(err).toBeInstanceOf(InvalidInput);
    expect(err.message).toBe('Invalid Input');
    expect(err.code).toBe('invalid.input');
  });

  it('BadRequest extends Error', () => {
    let err = new BadRequest('Invalid Input');

    expect(err).toBeInstanceOf(BadRequest);
    expect(err.message).toBe('Invalid Input');
    expect(err.code).toBe('bad.request');
  });

  it('NotAuthorized extends Error', () => {
    let err = new NotAuthorized('Not Authorized');

    expect(err).toBeInstanceOf(NotAuthorized);
    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Not Authorized');
    expect(err.code).toBe('not.authorized');
  });

  it('NotAuthenticated extends Error', () => {
    let err = new NotAuthenticated('Not Authenticated');

    expect(err).toBeInstanceOf(NotAuthenticated);
    expect(err.message).toBe('Not Authenticated');
    expect(err.code).toBe('not.authenticated');
  });

  it('Conflict extends Error', () => {
    let err = new Conflict('Conflict');

    expect(err).toBeInstanceOf(Conflict);
    expect(err.message).toBe('Conflict');
    expect(err.code).toBe('conflict');
  });
});
