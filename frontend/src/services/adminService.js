import api from './api';

export const adminService = {
  getAllKnowledge: async () => {
    const response = await api.get('/knowledge');
    return response.data.knowledge;
  },
  
  createKnowledge: async (data) => {
    const response = await api.post('/knowledge', data);
    return response.data.knowledge;
  },
  
  updateKnowledge: async (id, data) => {
    const response = await api.put(`/knowledge/${id}`, data);
    return response.data.knowledge;
  },
  
  deleteKnowledge: async (id) => {
    const response = await api.delete(`/knowledge/${id}`);
    return response.data;
  },
};