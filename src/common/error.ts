export class AppError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);

    // See: https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
