import { Router } from 'express';
import {createConversation, sendMessage, getMessages} from "../controllers/chat.controller";

const router = Router();

router.post('/conversations', createConversation);

router.post('/conversations/:conversationId/messages', sendMessage);

router.get('/conversations/:conversationId/messages', getMessages);

export default router;