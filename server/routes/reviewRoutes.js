const express = require('express');
const router = express.Router();
const { createReview, getWorkerReviews, getCustomerReviews } = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/', protect, restrictTo('customer'), createReview);
router.get('/worker/:workerId', getWorkerReviews);
router.get('/customer', protect, restrictTo('customer'), getCustomerReviews);

module.exports = router;
