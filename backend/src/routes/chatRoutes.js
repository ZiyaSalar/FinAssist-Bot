const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/auth');

router.post('/message', authenticate, chatController.sendMessage);
router.get('/conversations', authenticate, chatController.getConversations);
router.get('/conversations/:id', authenticate, chatController.getConversation);
router.delete('/conversations/:id', authenticate, chatController.deleteConversation);

module.exports = router;