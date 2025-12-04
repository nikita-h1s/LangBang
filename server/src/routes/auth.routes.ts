import express from 'express';
const router = express.Router();
import {register, login} from '../controllers/auth.controller';

// Auth endpoints
router.post('/register', register)
router.post('/login', login)

export default router;
