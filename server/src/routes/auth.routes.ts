import express from 'express';
import {register, login} from '../controllers/auth.controller';
import {validateRegister, validateLogin} from "../middlewares/validation/auth.validate";

const router = express.Router();

// Auth endpoints
router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)

export default router;
