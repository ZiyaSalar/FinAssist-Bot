const express = require('express');
const router = express.Router();
const knowledgeController = require('../controllers/knowledgeController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/', authenticate, knowledgeController.getAllKnowledge);
router.post('/', authenticate, isAdmin, knowledgeController.createKnowledge);
router.put('/:id', authenticate, isAdmin, knowledgeController.updateKnowledge);
router.delete('/:id', authenticate, isAdmin, knowledgeController.deleteKnowledge);

module.exports = router;
