export class AppError extends Error {
    constructor(public message: string) {
        super(message);
    }
}

export class EntityNotFoundError extends AppError {}

export class RelationError extends AppError {}
