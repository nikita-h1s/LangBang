import {HttpError} from "./HttpError";

export class UnauthorizedError extends HttpError {
    status = 401;

    constructor(message = 'Unauthorized') {
        super(message);
    }
}