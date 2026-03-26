export type ApiErrorPayload = {
  success: false;
  code: string;
  message: string;
  errors?: unknown;
};

export class AppError extends Error {
  statusCode: number;
  code: string;
  errors?: unknown;

  constructor(statusCode: number, code: string, message: string, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

export function ok<T>(data: T, message?: string) {
  return {
    success: true as const,
    message,
    data,
  };
}