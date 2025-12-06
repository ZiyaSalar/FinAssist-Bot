const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

class ConversationService {
  async create(userId, title = 'New Conversation') {
    const conversation = new Conversation({ userId, title });
    return await conversation.save();
  }
  
  async getById(id) {
    return await Conversation.findById(id);
  }
  
  async getUserConversations(userId) {
    return await Conversation.find({ userId, status: 'active' })
      .sort({ updatedAt: -1 });
  }
  
  async addMessage(conversationId, messageData) {
    const message = new Message({
      conversationId,
      ...messageData
    });
    
    await message.save();
    
    // Update conversation timestamp
    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: new Date()
    });
    
    return message;
  }
  
  async getMessages(conversationId) {
    return await Message.find({ conversationId }).sort({ timestamp: 1 });
  }
  
  async deleteConversation(id) {
    await Message.deleteMany({ conversationId: id });
    return await Conversation.findByIdAndDelete(id);
  }
}

module.exports = new ConversationService();
