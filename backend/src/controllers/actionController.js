const actionService = require('../services/actionService');

exports.bookAppointment = async (req, res, next) => {
  try {
    const result = await actionService.bookAppointment(req.body, req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await actionService.getUserAppointments(req.user.id);
    res.json({ success: true, appointments });
  } catch (error) {
    next(error);
  }
};

exports.checkOrderStatus = async (req, res, next) => {
  try {
    const result = await actionService.checkOrderStatus(req.body, req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};