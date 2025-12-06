const knowledgeService = require('../services/knowledgeService');

exports.getAllKnowledge = async (req, res, next) => {
  try {
    const knowledge = await knowledgeService.getAllKnowledge();
    res.json({ success: true, knowledge });
  } catch (error) {
    next(error);
  }
};

exports.createKnowledge = async (req, res, next) => {
  try {
    const knowledge = await knowledgeService.createKnowledge(req.body);
    res.status(201).json({ success: true, knowledge });
  } catch (error) {
    next(error);
  }
};

exports.updateKnowledge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const knowledge = await knowledgeService.updateKnowledge(id, req.body);
    
    if (!knowledge) {
      return res.status(404).json({ error: 'Knowledge not found' });
    }
    
    res.json({ success: true, knowledge });
  } catch (error) {
    next(error);
  }
};

exports.deleteKnowledge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const knowledge = await knowledgeService.deleteKnowledge(id);
    
    if (!knowledge) {
      return res.status(404).json({ error: 'Knowledge not found' });
    }
    
    res.json({ success: true, message: 'Knowledge deleted' });
  } catch (error) {
    next(error);
  }
};
