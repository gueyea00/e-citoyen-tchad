import { Router } from 'express';
import { handleChatbotMessage } from '../controllers/chatbot.controller.js';

const router = Router();

// POST /api/chatbot/message
router.post('/message', handleChatbotMessage);

export default router;
