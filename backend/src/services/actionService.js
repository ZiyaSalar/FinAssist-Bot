const Appointment = require('../models/Appointment');
const Order = require('../models/Order');

class ActionService {
  async bookAppointment(params, userId) {
    try {
      const appointmentId = `APT-${Date.now()}`;
      const date = params.date || new Date(Date.now() + 86400000); // Tomorrow
      const time = params.time || '2:00 PM';
      
      const appointment = new Appointment({
        userId,
        appointmentId,
        date,
        time,
        status: 'confirmed',
      });
      
      await appointment.save();
      
      return {
        success: true,
        message: `Great! I've booked your appointment for ${date.toLocaleDateString()} at ${time}. Your appointment ID is ${appointmentId}.`,
        data: {
          appointmentId,
          date: date.toLocaleDateString(),
          time,
          status: 'confirmed'
        }
      };
    } catch (error) {
      console.error('Appointment booking error:', error);
      return {
        success: false,
        message: 'Sorry, I encountered an error booking your appointment.',
        data: null
      };
    }
  }
  
  async checkOrderStatus(params, userId) {
    try {
      let order;
      
      if (params.orderId) {
        order = await Order.findOne({ orderId: params.orderId, userId });
      } else {
        order = await Order.findOne({ userId }).sort({ createdAt: -1 });
      }
      
      if (!order) {
        // Create a mock order for demo
        const orderId = `ORD-${Math.floor(Math.random() * 10000)}`;
        order = new Order({
          userId,
          orderId,
          status: 'shipped',
          items: [{ name: 'Sample Product', quantity: 1, price: 99.99 }],
          totalAmount: 99.99,
          trackingNumber: `TRK${Math.floor(Math.random() * 1000000)}`,
          estimatedDelivery: new Date(Date.now() + 3 * 86400000)
        });
        await order.save();
      }
      
      return {
        success: true,
        message: `I found your order ${order.orderId}. Status: ${order.status}. Estimated delivery: ${order.estimatedDelivery?.toLocaleDateString()}. Tracking: ${order.trackingNumber}`,
        data: {
          orderId: order.orderId,
          status: order.status,
          trackingNumber: order.trackingNumber,
          estimatedDelivery: order.estimatedDelivery?.toLocaleDateString()
        }
      };
    } catch (error) {
      console.error('Order status check error:', error);
      return {
        success: false,
        message: 'Sorry, I encountered an error checking your order status.',
        data: null
      };
    }
  }
  
  async cancelOrder(params, userId) {
    try {
      let order;
      
      if (params.orderId) {
        order = await Order.findOne({ orderId: params.orderId, userId });
      } else {
        order = await Order.findOne({ 
          userId, 
          status: { $ne: 'cancelled' } 
        }).sort({ createdAt: -1 });
      }
      
      if (!order) {
        return {
          success: false,
          message: 'No order found to cancel.',
          data: null
        };
      }
      
      order.status = 'cancelled';
      await order.save();
      
      return {
        success: true,
        message: `Your order ${order.orderId} has been successfully cancelled. Refund will be processed in 3-5 business days.`,
        data: {
          orderId: order.orderId,
          status: 'cancelled'
        }
      };
    } catch (error) {
      console.error('Order cancellation error:', error);
      return {
        success: false,
        message: 'Sorry, I encountered an error cancelling your order.',
        data: null
      };
    }
  }
  
  async getUserAppointments(userId) {
    return await Appointment.find({ userId }).sort({ date: -1 });
  }
}

module.exports = new ActionService();