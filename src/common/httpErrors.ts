import { AppError } from './error';

export class InternalServerError extends AppError {
  constructor() {
    super('server.error', 'Internal Server Error');
  }
}

export class NotFound extends AppError {
  constructor(message: string) {
    super('not.found', message);
  }
}

export class InvalidInput extends AppError {
  constructor(message: string) {
    super('invalid.input', message);
  }
}

export class BadRequest extends AppError {
  constructor(message: string) {
    super('bad.request', message);
  }
}

export class NotAuthorized extends AppError {
  constructor(message: string) {
    super('not.authorized', message);
  }
}

export class NotAuthenticated extends AppError {
  constructor(message: string) {
    super('not.authenticated', message);
  }
}

export class Conflict extends AppError {
  constructor(message: string) {
    super('conflict', message);
  }
}
