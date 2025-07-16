const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth } = require('../middleware/auth');

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    // Check if user is admin (you can customize this logic)
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    
    if (!adminEmails.includes(req.user.email)) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// All routes require authentication and admin access
router.use(auth);
router.use(adminAuth);

// Statistics and analytics
router.get('/statistics', adminController.getStatistics);
router.get('/analytics/subscriptions', adminController.getSubscriptionAnalytics);
router.get('/activity/recent', adminController.getRecentActivity);
router.get('/system/health', adminController.getSystemHealth);

// User management
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetails);
router.put('/users/:id/status', adminController.updateUserStatus);

module.exports = router;