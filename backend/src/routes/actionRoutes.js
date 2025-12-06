const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');
const { authenticate } = require('../middleware/auth');

router.post('/appointment', authenticate, actionController.bookAppointment);
router.get('/appointments', authenticate, actionController.getAppointments);
router.post('/order/status', authenticate, actionController.checkOrderStatus);

module.exports = router;