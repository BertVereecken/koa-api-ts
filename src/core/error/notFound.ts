import { BaseError } from './baseError';

class NotFoundError extends BaseError {
  constructor(message: string, code: string) {
    super(message, code, 404);
  }
}

export { NotFoundError };
