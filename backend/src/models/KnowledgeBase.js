const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  keywords: [{
    type: String,
    lowercase: true,
  }],
  question: {
    type: String,
  },
  answer: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

knowledgeBaseSchema.index({ keywords: 1 });
knowledgeBaseSchema.index({ category: 1 });

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);