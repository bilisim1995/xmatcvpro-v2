export class ModelNotFoundError extends Error {
  constructor(id: string) {
    super(`Model with ID ${id} not found`);
    this.name = 'ModelNotFoundError';
  }
}

export class InvalidModelDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidModelDataError';
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}