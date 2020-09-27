class BaseError extends Error {
  readonly code: string;
  readonly status: number;
  readonly wrappedError?: Error;

  constructor(message: string, code: string, status: number, wrappedError?: Error) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.wrappedError = wrappedError;
  }
}

export { BaseError };
