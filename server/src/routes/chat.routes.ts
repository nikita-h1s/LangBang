import { Router } from 'express';
import {createConversation, sendMessage, getMessages} from "../controllers/chat.controller";
import {authenticateToken} from "../middlewares/auth.middleware";

const router = Router();

router.post('/conversations', authenticateToken, createConversation);

router.post('/conversations/:conversationId/messages', authenticateToken, sendMessage);

router.get('/conversations/:conversationId/messages', authenticateToken, getMessages);

export default router;