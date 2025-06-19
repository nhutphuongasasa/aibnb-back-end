export class AppError extends Error {
    private statusCode: number
    private errors?: any

    constructor(statusCode: number, message: string, errors?: any){
        super(message)
        this.statusCode = statusCode;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}