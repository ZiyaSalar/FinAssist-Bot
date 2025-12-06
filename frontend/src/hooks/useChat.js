import { useState } from 'react';
import { chatService } from '../services/chatService';

export const useChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const sendMessage = async (message, conversationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatService.sendMessage(message, conversationId);
      return response;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const getConversations = async () => {
    try {
      return await chatService.getConversations();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load conversations');
      throw err;
    }
  };
  
  const getConversation = async (id) => {
    try {
      return await chatService.getConversation(id);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load conversation');
      throw err;
    }
  };
  
  return { sendMessage, getConversations, getConversation, loading, error };
};