import api from './api';

export const chatService = {
  sendMessage: async (message, conversationId) => {
    const response = await api.post('/chat/message', {
      message,
      conversationId,
    });
    return response.data;
  },
  
  getConversations: async () => {
    const response = await api.get('/chat/conversations');
    return response.data.conversations;
  },
  
  getConversation: async (id) => {
    const response = await api.get(`/chat/conversations/${id}`);
    return response.data;
  },
  
  deleteConversation: async (id) => {
    const response = await api.delete(`/chat/conversations/${id}`);
    return response.data;
  },
};

