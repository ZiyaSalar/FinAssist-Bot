const conversationService = require('../services/conversationService');
const nlpService = require('../services/nlpService');
const knowledgeService = require('../services/knowledgeService');
const actionService = require('../services/actionService');

exports.sendMessage = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user.id;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Get or create conversation
    let conversation = conversationId 
      ? await conversationService.getById(conversationId)
      : await conversationService.create(userId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Save user message
    await conversationService.addMessage(conversation._id, {
      userId,
      type: 'user',
      content: message,
    });
    
    // Detect intent
    const intent = nlpService.detectIntent(message);
    
    let response;
    
    if (intent.type === 'information') {
      // Information retrieval
      const knowledge = await knowledgeService.searchKnowledge(message);
      
      if (knowledge) {
        response = {
          content: knowledge.answer,
          type: 'information',
          topic: knowledge.category
        };
      } else {
        response = {
          content: "I'm not sure I have information about that. I can help you with:\n\n• Business hours and location\n• Shipping and delivery\n• Returns and refunds\n• Payment methods\n• Contact information\n\nOr I can help you:\n• Book appointments\n• Check order status\n• Cancel orders\n\nWhat would you like to know?",
          type: 'help'
        };
      }
    } else if (intent.type === 'action') {
      // Action execution
      let result;
      
      if (intent.action === 'bookAppointment') {
        result = await actionService.bookAppointment(intent.parameters, userId);
      } else if (intent.action === 'checkOrderStatus') {
        result = await actionService.checkOrderStatus(intent.parameters, userId);
      } else if (intent.action === 'cancelOrder') {
        result = await actionService.cancelOrder(intent.parameters, userId);
      }
      
      response = {
        content: result.message,
        type: 'action',
        action: intent.action,
        actionResult: result.data
      };
    }
    
    // Save bot response
    await conversationService.addMessage(conversation._id, {
      type: 'bot',
      content: response.content,
      intent: intent.type,
      action: response.action,
      actionResult: response.actionResult,
    });
    
    res.json({
      success: true,
      conversationId: conversation._id,
      response: response.content,
      type: response.type,
      action: response.action,
      actionResult: response.actionResult
    });
    
  } catch (error) {
    next(error);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await conversationService.getUserConversations(req.user.id);
    res.json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};

exports.getConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversation = await conversationService.getById(id);
    
    if (!conversation || conversation.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const messages = await conversationService.getMessages(id);
    
    res.json({ 
      success: true, 
      conversation,
      messages 
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversation = await conversationService.getById(id);
    
    if (!conversation || conversation.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    await conversationService.deleteConversation(id);
    res.json({ success: true, message: 'Conversation deleted' });
  } catch (error) {
    next(error);
  }
};
