const express = require('express');
const router = express.Router();
const { getCustomerDashboard, getWorkerDashboard } = require('../controllers/dashboardController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/customer', protect, restrictTo('customer'), getCustomerDashboard);
router.get('/worker', protect, restrictTo('worker'), getWorkerDashboard);

module.exports = router;
