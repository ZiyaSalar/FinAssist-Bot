import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../hooks/useAuth';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Loader } from 'lucide-react';

export default function AdminDashboard() {
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    keywords: '',
    question: '',
    answer: '',
    priority: 5,
    isActive: true
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    loadKnowledge();
  }, []);
  
  const loadKnowledge = async () => {
    try {
      const data = await adminService.getAllKnowledge();
      setKnowledge(data);
    } catch (error) {
      console.error('Failed to load knowledge:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAdd = async () => {
    try {
      const keywords = formData.keywords.split(',').map(k => k.trim().toLowerCase());
      await adminService.createKnowledge({ ...formData, keywords });
      await loadKnowledge();
      resetForm();
    } catch (error) {
      alert('Failed to add knowledge');
    }
  };
  
  const handleUpdate = async (id) => {
    try {
      const item = knowledge.find(k => k._id === id);
      const keywords = Array.isArray(item.keywords) 
        ? item.keywords 
        : item.keywords.split(',').map(k => k.trim().toLowerCase());
      await adminService.updateKnowledge(id, { ...item, keywords });
      setEditingId(null);
      await loadKnowledge();
    } catch (error) {
      alert('Failed to update knowledge');
    }
  };
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this knowledge item?')) return;
    
    try {
      await adminService.deleteKnowledge(id);
      await loadKnowledge();
    } catch (error) {
      alert('Failed to delete knowledge');
    }
  };
  
  const resetForm = () => {
    setFormData({
      category: '',
      keywords: '',
      question: '',
      answer: '',
      priority: 5,
      isActive: true
    });
    setShowAddForm(false);
  };
  
  const updateKnowledgeItem = (id, field, value) => {
    setKnowledge(knowledge.map(item => 
      item._id === id ? { ...item, [field]: value } : item
    ));
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Manage knowledge base</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Knowledge Base</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddForm ? 'Cancel' : 'Add Knowledge'}
            </button>
          </div>
          
          {/* Add Form */}
          {showAddForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., hours, shipping, returns"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., hours, open, close, timing"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question (optional)
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="What are your business hours?"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="3"
                  placeholder="We are open Monday to Friday..."
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Priority:</label>
                    <input
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAdd}
                  disabled={!formData.category || !formData.answer}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Add Knowledge
                </button>
              </div>
            </div>
          )}
          
          {/* Knowledge List */}
          <div className="space-y-3">
            {knowledge.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No knowledge items yet</p>
            ) : (
              knowledge.map((item) => (
                <div
                  key={item._id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                >
                  {editingId === item._id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => updateKnowledgeItem(item._id, 'category', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Category"
                        />
                        <input
                          type="text"
                          value={Array.isArray(item.keywords) ? item.keywords.join(', ') : item.keywords}
                          onChange={(e) => updateKnowledgeItem(item._id, 'keywords', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Keywords"
                        />
                      </div>
                      <input
                        type="text"
                        value={item.question || ''}
                        onChange={(e) => updateKnowledgeItem(item._id, 'question', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Question"
                      />
                      <textarea
                        value={item.answer}
                        onChange={(e) => updateKnowledgeItem(item._id, 'answer', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows="3"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.isActive}
                              onChange={(e) => updateKnowledgeItem(item._id, 'isActive', e.target.checked)}
                              className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">Active</span>
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(item._id)}
                            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-block px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded">
                              {item.category}
                            </span>
                            {!item.isActive && (
                              <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                                Inactive
                              </span>
                            )}
                            <span className="text-xs text-gray-500">Priority: {item.priority}</span>
                          </div>
                          {item.question && (
                            <p className="font-medium text-gray-800 mb-1">{item.question}</p>
                          )}
                          <p className="text-sm text-gray-600">{item.answer}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Keywords: {Array.isArray(item.keywords) ? item.keywords.join(', ') : item.keywords}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => setEditingId(item._id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}