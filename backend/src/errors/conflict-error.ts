class ConflictError extends Error {
  public statusCode: number;

  public textError: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.textError = message;
    this.statusCode = statusCode;
  }
}

export default ConflictError;
