import {assert} from 'chai';
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

    assert.instanceOf(err, NotFound);
    assert.equal(err.message, 'Not Found');
    assert.equal(err.code, 'not.found');
  });

  it('InvalidInput extends Error', () => {
    let err = new InvalidInput('Invalid Input');

    assert.instanceOf(err, InvalidInput);
    assert.equal(err.message, 'Invalid Input');
    assert.equal(err.code, 'invalid.input');
  });

  it('BadRequest extends Error', () => {
    let err = new BadRequest('Invalid Input');

    assert.instanceOf(err, BadRequest);
    assert.equal(err.message, 'Invalid Input');
    assert.equal(err.code, 'bad.request');
  });

  it('NotAuthorized extends Error', () => {
    let err = new NotAuthorized('Not Authorized');

    assert.instanceOf(err, NotAuthorized);
    assert.instanceOf(err, AppError);
    assert.instanceOf(err, Error);
    assert.equal(err.message, 'Not Authorized');
    assert.equal(err.code, 'not.authorized');
  });

  it('NotAuthenticated extends Error', () => {
    let err = new NotAuthenticated('Not Authenticated');

    assert.instanceOf(err, NotAuthenticated);
    assert.equal(err.message, 'Not Authenticated');
    assert.equal(err.code, 'not.authenticated');
  });

  it('Conflict extends Error', () => {
    let err = new Conflict('Conflict');

    assert.instanceOf(err, Conflict);
    assert.equal(err.message, 'Conflict');
    assert.equal(err.code, 'conflict');
  });
});
