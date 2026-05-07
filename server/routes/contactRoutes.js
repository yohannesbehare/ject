// contactRoutes.js
const express = require('express');
const router = express.Router();
const { createContact, getCustomerContacts, getWorkerContacts, updateContactStatus } = require('../controllers/contactController');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/', protect, restrictTo('customer'), createContact);
router.get('/customer', protect, restrictTo('customer'), getCustomerContacts);
router.get('/worker', protect, restrictTo('worker'), getWorkerContacts);
router.patch('/:id', protect, restrictTo('worker'), updateContactStatus);

module.exports = router;
