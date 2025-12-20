import express from 'express';
import {
    register,
    login,
    refresh,
    logout
} from '../controllers/auth.controller';
import {validateRegister, validateLogin} from "../middlewares/validation/auth.validate";

const router = express.Router();

// Auth endpoints
router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.post('/logout', logout)
router.post('/refresh', refresh)

export default router;
