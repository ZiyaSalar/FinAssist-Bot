const KnowledgeBase = require('../models/KnowledgeBase');

class KnowledgeService {
  async searchKnowledge(query) {
    try {
      const keywords = query.toLowerCase()
        .split(' ')
        .filter(w => w.length > 2);
      
      const results = await KnowledgeBase.find({
        $or: [
          { keywords: { $in: keywords } },
          { question: { $regex: query, $options: 'i' } },
          { answer: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } }
        ],
        isActive: true
      }).sort({ priority: -1 }).limit(1);
      
      return results[0] || null;
    } catch (error) {
      console.error('Knowledge search error:', error);
      return null;
    }
  }
  
  async createKnowledge(data) {
    const knowledge = new KnowledgeBase(data);
    return await knowledge.save();
  }
  
  async getAllKnowledge() {
    return await KnowledgeBase.find().sort({ priority: -1, createdAt: -1 });
  }
  
  async updateKnowledge(id, data) {
    return await KnowledgeBase.findByIdAndUpdate(id, data, { new: true });
  }
  
  async deleteKnowledge(id) {
    return await KnowledgeBase.findByIdAndDelete(id);
  }
}

module.exports = new KnowledgeService();