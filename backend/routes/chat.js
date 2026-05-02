const express = require('express');
const router = express.Router();
const { getConversations, createConversation, getMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// Tất cả chat routes đều cần auth
router.get('/conversations', protect, getConversations);
router.post('/conversations', protect, createConversation);
router.get('/messages/:conversationId', protect, getMessages);

module.exports = router;
