const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate user
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account has been deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if user owns the resource
const checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user._id;

      const resource = await model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      if (resource.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

// Middleware to check subscription limits
const checkSubscriptionLimits = (resourceType) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const limits = {
        free: {
          portfolio: 3,
          testimonials: 5,
          services: 3,
          awards: 3
        },
        premium: {
          portfolio: 20,
          testimonials: 20,
          services: 10,
          awards: 10
        },
        enterprise: {
          portfolio: -1, // unlimited
          testimonials: -1,
          services: -1,
          awards: -1
        }
      };

      const userLimits = limits[user.subscription] || limits.free;
      const resourceLimit = userLimits[resourceType];

      // If unlimited (-1), allow
      if (resourceLimit === -1) {
        return next();
      }

      // Check current count
      const Model = require(`../models/${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`);
      const currentCount = await Model.countDocuments({ userId: user._id });

      if (currentCount >= resourceLimit) {
        return res.status(403).json({ 
          message: `Subscription limit reached. You can have maximum ${resourceLimit} ${resourceType} items.`,
          limit: resourceLimit,
          current: currentCount
        });
      }

      next();
    } catch (error) {
      console.error('Subscription limits check error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

// Middleware to check if subscription is active
const checkActiveSubscription = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (user.subscription === 'free') {
      return next();
    }

    if (user.subscriptionExpires && user.subscriptionExpires < new Date()) {
      // Downgrade to free
      user.subscription = 'free';
      await user.save();
      
      return res.status(402).json({ 
        message: 'Subscription expired. Please renew to continue using premium features.',
        subscription: 'free'
      });
    }

    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  auth,
  checkOwnership,
  checkSubscriptionLimits,
  checkActiveSubscription
};