import { BaseError } from './baseError';

class InputValidationError extends BaseError {
  readonly validationErrors: Record<string, string>;

  constructor(validationErrors: Record<string, string>) {
    super('Invalid input', 'INVALID_INPUT', 400);
    this.validationErrors = validationErrors;
  }
}

export { InputValidationError };
