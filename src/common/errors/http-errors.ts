import { AppError, EntityNotFoundError,RelationError } from './app-errors';

export class HttpError extends Error {
    constructor(
        public message: string,
        public status: number,
    ) {
        super(message);
    }

    static NotFound(message: string) {
        return new HttpError(message, 404);
    }

    static BadRequest(message: string) {
        return new HttpError(message, 400);
    }

    static Conflict(message: string) {
        return new HttpError(message, 409);
    }

    static Internal(message: string) {
        return new HttpError(message, 500);
    }

    static fromAppError(error: AppError) {
        if (error instanceof EntityNotFoundError) {
            return this.NotFound(error.message);
        } else if (error instanceof RelationError) {
            return this.Conflict(error.message);
        }
        return this.Internal(error.message);
    }
}
