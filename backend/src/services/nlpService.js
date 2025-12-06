class NLPService {
  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Action intents
    if ((lowerMessage.includes('book') || lowerMessage.includes('schedule')) && 
        (lowerMessage.includes('appointment') || lowerMessage.includes('meeting'))) {
      return { 
        type: 'action', 
        action: 'bookAppointment',
        parameters: this.extractAppointmentParams(message)
      };
    }
    
    if (lowerMessage.includes('check') && lowerMessage.includes('order')) {
      return { 
        type: 'action', 
        action: 'checkOrderStatus',
        parameters: this.extractOrderParams(message)
      };
    }
    
    if (lowerMessage.includes('cancel') && lowerMessage.includes('order')) {
      return { 
        type: 'action', 
        action: 'cancelOrder',
        parameters: this.extractOrderParams(message)
      };
    }
    
    // Information retrieval intent
    return { type: 'information' };
  }
  
  extractAppointmentParams(message) {
    const params = {};
    const lowerMessage = message.toLowerCase();
    
    // Extract date
    if (lowerMessage.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      params.date = tomorrow;
    } else if (lowerMessage.includes('today')) {
      params.date = new Date();
    } else if (lowerMessage.includes('next week')) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      params.date = nextWeek;
    }
    
    // Extract time
    const timeMatch = message.match(/(\d{1,2})(:|am|pm|\s*(am|pm))/i);
    if (timeMatch) {
      params.time = timeMatch[0];
    }
    
    return params;
  }
  
  extractOrderParams(message) {
    const params = {};
    const orderMatch = message.match(/ORD-\d+/i);
    if (orderMatch) {
      params.orderId = orderMatch[0];
    }
    return params;
  }
}

module.exports = new NLPService();
