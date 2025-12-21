import { HttpError } from './HttpError';

export class ConflictError extends HttpError {
    status = 409;

    constructor(message = 'Conflict') {
        super(message);
    }
}