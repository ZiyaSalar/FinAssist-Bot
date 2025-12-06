// ============================================
// FILE: frontend/src/components/Chat/ChatContainer.jsx
// ============================================
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import { Bot, User, Send, Loader, LogOut, Menu, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChatContainer() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I can help you with information about our products and services, or perform actions like booking appointments, checking order status, and more. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const { user, logout } = useAuth();
  const { sendMessage, loading } = useChat();
  const navigate = useNavigate();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    
    try {
      const response = await sendMessage(currentInput, conversationId);
      
      if (!conversationId) {
        setConversationId(response.conversationId);
      }
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.response,
        action: response.action,
        actionResult: response.actionResult,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const startNewChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: 'Hello! How can I assist you today?',
        timestamp: new Date()
      }
    ]);
    setConversationId(null);
    setSidebarOpen(false);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-20 w-64 bg-white border-r border-gray-200 h-full transition-transform duration-300`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-indigo-600" />
              <span className="font-bold text-gray-800">AI Chatbot</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <button
            onClick={startNewChat}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            New Chat
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">User</p>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="bg-indigo-600 p-1 rounded-full">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          
          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mb-2"
            >
              Admin Dashboard
            </button>
          )}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">AI Assistant</h1>
              <p className="text-xs text-gray-500">Online and ready to help</p>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' ? 'bg-indigo-600' : 'bg-gray-300'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-gray-700" />
                )}
              </div>
              
              <div className={`flex flex-col max-w-xs md:max-w-md lg:max-w-lg ${
                message.type === 'user' ? 'items-end' : 'items-start'
              }`}>
                <div className={`px-4 py-2 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-800 shadow-md'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                
                {message.action && message.actionResult && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg max-w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-xs font-semibold text-green-800">
                        Action: {message.action}
                      </span>
                    </div>
                    <pre className="text-xs text-green-700 overflow-x-auto">
                      {JSON.stringify(message.actionResult, null, 2)}
                    </pre>
                  </div>
                )}
                
                <span className="text-xs text-gray-500 mt-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <Bot className="w-5 h-5 text-gray-700" />
              </div>
              <div className="bg-white shadow-md px-4 py-2 rounded-2xl">
                <Loader className="w-5 h-5 text-gray-500 animate-spin" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setInput('What are your business hours?')}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Business Hours
              </button>
              <button
                onClick={() => setInput('Book an appointment for tomorrow')}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Book Appointment
              </button>
              <button
                onClick={() => setInput('Check my order status')}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Order Status
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}