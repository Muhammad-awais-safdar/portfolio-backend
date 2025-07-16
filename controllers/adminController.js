const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Portfolio = require('../models/Portfolio');
const mongoose = require('mongoose');

// Get platform statistics
exports.getStatistics = async (req, res) => {
  try {
    const stats = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ subscription: 'free' }),
      User.countDocuments({ subscription: 'premium' }),
      User.countDocuments({ subscription: 'enterprise' }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      Portfolio.countDocuments(),
      Subscription.countDocuments({ status: 'active' }),
      Subscription.countDocuments({ status: 'cancelled' }),
      Subscription.countDocuments({ status: 'expired' })
    ]);

    const [
      totalUsers,
      freeUsers,
      premiumUsers,
      enterpriseUsers,
      activeUsers,
      inactiveUsers,
      totalPortfolios,
      activeSubscriptions,
      cancelledSubscriptions,
      expiredSubscriptions
    ] = stats;

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentRegistrations = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });

    // Get monthly revenue estimate
    const monthlyRevenue = await Subscription.aggregate([
      {
        $match: {
          status: 'active',
          billingCycle: 'monthly'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const yearlyRevenue = await Subscription.aggregate([
      {
        $match: {
          status: 'active',
          billingCycle: 'yearly'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const estimatedMonthlyRevenue = 
      (monthlyRevenue[0]?.total || 0) + 
      ((yearlyRevenue[0]?.total || 0) / 12);

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        recent: recentRegistrations,
        bySubscription: {
          free: freeUsers,
          premium: premiumUsers,
          enterprise: enterpriseUsers
        }
      },
      portfolios: {
        total: totalPortfolios,
        averagePerUser: totalUsers > 0 ? (totalPortfolios / totalUsers).toFixed(2) : 0
      },
      subscriptions: {
        active: activeSubscriptions,
        cancelled: cancelledSubscriptions,
        expired: expiredSubscriptions
      },
      revenue: {
        estimatedMonthly: estimatedMonthlyRevenue.toFixed(2),
        currency: 'USD'
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users with pagination
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const subscription = req.query.subscription || '';
    const status = req.query.status || '';

    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = {};
    
    if (search) {
      searchQuery.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { subdomain: { $regex: search, $options: 'i' } }
      ];
    }

    if (subscription) {
      searchQuery.subscription = subscription;
    }

    if (status) {
      searchQuery.isActive = status === 'active';
    }

    const users = await User.find(searchQuery)
      .select('-password -emailVerificationToken -passwordResetToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user details
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .select('-password -emailVerificationToken -passwordResetToken');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's subscription
    const subscription = await Subscription.findOne({ 
      userId, 
      status: { $in: ['active', 'cancelled'] } 
    }).sort({ createdAt: -1 });

    // Get user's portfolio count
    const portfolioCount = await Portfolio.countDocuments({ userId });

    res.json({
      user,
      subscription,
      portfolioCount
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password -emailVerificationToken -passwordResetToken');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get recent activity
exports.getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent user registrations
    const recentUsers = await User.find({ isActive: true })
      .select('fullName email subdomain createdAt')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Get recent subscriptions
    const recentSubscriptions = await Subscription.find()
      .populate('userId', 'fullName email subdomain')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Get recent portfolio updates
    const recentPortfolios = await Portfolio.find()
      .populate('userId', 'fullName email subdomain')
      .sort({ updatedAt: -1 })
      .limit(limit);

    res.json({
      recentUsers,
      recentSubscriptions,
      recentPortfolios
    });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get subscription analytics
exports.getSubscriptionAnalytics = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get subscription trends
    const subscriptionTrends = await Subscription.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            planId: '$planId'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    // Get churn rate
    const cancelledSubscriptions = await Subscription.countDocuments({
      status: 'cancelled',
      updatedAt: { $gte: startDate }
    });

    const totalActiveSubscriptions = await Subscription.countDocuments({
      status: 'active'
    });

    const churnRate = totalActiveSubscriptions > 0 ? 
      (cancelledSubscriptions / totalActiveSubscriptions * 100).toFixed(2) : 0;

    res.json({
      subscriptionTrends,
      churnRate,
      period: `${days} days`
    });
  } catch (error) {
    console.error('Get subscription analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// System health check
exports.getSystemHealth = async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Check database response time
    const start = Date.now();
    await User.findOne().limit(1);
    const dbResponseTime = Date.now() - start;

    // Get memory usage
    const memoryUsage = process.memoryUsage();

    res.json({
      status: 'healthy',
      database: {
        status: dbStatus,
        responseTime: `${dbResponseTime}ms`
      },
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('System health check error:', error);
    res.status(500).json({ 
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};