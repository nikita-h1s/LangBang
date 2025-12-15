import {NextFunction, Request, Response} from 'express'
import {registerUser, loginUser} from '../services/auth.service'
import {
    RegisterInput,
    LoginInput
} from '../middlewares/validation/auth.schema'


// Register a new user
export const register = async (
    req: Request<{}, {}, RegisterInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {username, email, password} = req.body;

        const newUser = await registerUser({username, email, password});

        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });
    } catch (err) {
        next(err)
    }
}

// Log in a user
export const login = async (
    req: Request<{}, {}, LoginInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {email, password} = req.body;

        const result = await loginUser(email, password);

        res.status(200).json(
            {
                message: 'User logged in successfully',
                user: result.user,
                token: result.token
            }
        );
    } catch (err) {
        next(err)
    }
}
