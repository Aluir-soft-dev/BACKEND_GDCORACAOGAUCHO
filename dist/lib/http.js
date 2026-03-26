export class AppError extends Error {
    statusCode;
    code;
    errors;
    constructor(statusCode, code, message, errors) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.errors = errors;
    }
}
export function ok(data, message) {
    return {
        success: true,
        message,
        data,
    };
}
