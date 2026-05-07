const express = require('express');
const router = express.Router();
const {
  getWorkers, getWorker, updateProfile, toggleAvailability,
  incrementView, uploadPhoto, uploadSample, deleteSample,
} = require('../controllers/workerController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', getWorkers);
router.get('/:id', getWorker);
router.post('/:id/view', incrementView);

router.patch('/profile', protect, restrictTo('worker'), updateProfile);
router.patch('/availability', protect, restrictTo('worker'), toggleAvailability);
router.post('/upload-photo', protect, restrictTo('worker'), uploadPhoto);
router.post('/upload-sample', protect, restrictTo('worker'), uploadSample);
router.delete('/sample/:index', protect, restrictTo('worker'), deleteSample);

module.exports = router;
