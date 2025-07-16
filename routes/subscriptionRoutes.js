const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// All routes require authentication
router.get('/current', subscriptionController.getCurrentSubscription);
router.get('/history', subscriptionController.getSubscriptionHistory);
router.get('/plans', subscriptionController.getPlans);
router.post('/upgrade', subscriptionController.upgradeSubscription);
router.post('/cancel', subscriptionController.cancelSubscription);
router.post('/reactivate', subscriptionController.reactivateSubscription);
router.get('/limits/:type', subscriptionController.checkLimits);

module.exports = router;