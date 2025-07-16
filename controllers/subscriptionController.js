const Subscription = require('../models/Subscription');
const User = require('../models/User');

// Get current user's subscription
exports.getCurrentSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const subscription = await Subscription.findOne({ 
      userId, 
      status: { $in: ['active', 'cancelled'] } 
    }).sort({ createdAt: -1 });

    if (!subscription) {
      // Create default free subscription if none exists
      const freeSubscription = new Subscription({
        userId,
        planId: 'free',
        status: 'active',
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        features: Subscription.getPlanFeatures('free')
      });
      
      await freeSubscription.save();
      return res.json(freeSubscription);
    }

    // Check if subscription is expired
    if (subscription.isExpired() && subscription.status === 'active') {
      subscription.status = 'expired';
      await subscription.save();
      
      // Update user subscription status
      await User.findByIdAndUpdate(userId, { 
        subscription: 'free',
        subscriptionExpires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      });
    }

    res.json(subscription);
  } catch (error) {
    console.error('Get current subscription error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get subscription history
exports.getSubscriptionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const subscriptions = await Subscription.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(subscriptions);
  } catch (error) {
    console.error('Get subscription history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available plans
exports.getPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'USD',
        billing: 'forever',
        features: Subscription.getPlanFeatures('free'),
        description: 'Perfect for getting started',
        popular: false
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 9.99,
        currency: 'USD',
        billing: 'monthly',
        features: Subscription.getPlanFeatures('premium'),
        description: 'Best for professionals',
        popular: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 29.99,
        currency: 'USD',
        billing: 'monthly',
        features: Subscription.getPlanFeatures('enterprise'),
        description: 'For teams and agencies',
        popular: false
      }
    ];

    res.json(plans);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upgrade subscription
exports.upgradeSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const { planId, paymentMethod, paymentId, billingCycle } = req.body;

    // Validate plan
    const validPlans = ['premium', 'enterprise'];
    if (!validPlans.includes(planId)) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    // Get current subscription
    const currentSubscription = await Subscription.findOne({ 
      userId, 
      status: 'active' 
    });

    if (currentSubscription) {
      // Cancel current subscription
      currentSubscription.status = 'cancelled';
      await currentSubscription.save();
    }

    // Calculate end date based on billing cycle
    const endDate = new Date();
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Create new subscription
    const newSubscription = new Subscription({
      userId,
      planId,
      status: 'active',
      endDate,
      paymentMethod,
      paymentId,
      amount: billingCycle === 'yearly' ? 
        (planId === 'premium' ? 99.99 : 299.99) : 
        (planId === 'premium' ? 9.99 : 29.99),
      billingCycle,
      features: Subscription.getPlanFeatures(planId)
    });

    await newSubscription.save();

    // Update user subscription info
    await User.findByIdAndUpdate(userId, {
      subscription: planId,
      subscriptionExpires: endDate
    });

    res.json({
      message: 'Subscription upgraded successfully',
      subscription: newSubscription
    });
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reason } = req.body;

    const subscription = await Subscription.findOne({ 
      userId, 
      status: 'active' 
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    if (subscription.planId === 'free') {
      return res.status(400).json({ message: 'Cannot cancel free subscription' });
    }

    // Update subscription status
    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    subscription.metadata.cancellationReason = reason;
    await subscription.save();

    // Create free subscription for the remaining period
    const freeSubscription = new Subscription({
      userId,
      planId: 'free',
      status: 'active',
      startDate: subscription.endDate,
      endDate: new Date(subscription.endDate.getTime() + 365 * 24 * 60 * 60 * 1000),
      features: Subscription.getPlanFeatures('free')
    });

    await freeSubscription.save();

    res.json({
      message: 'Subscription cancelled successfully',
      subscription: subscription
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reactivate subscription
exports.reactivateSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const { planId, paymentMethod, paymentId } = req.body;

    // Find cancelled subscription
    const subscription = await Subscription.findOne({ 
      userId, 
      status: 'cancelled' 
    }).sort({ createdAt: -1 });

    if (!subscription) {
      return res.status(404).json({ message: 'No cancelled subscription found' });
    }

    // Reactivate subscription
    subscription.status = 'active';
    subscription.planId = planId || subscription.planId;
    subscription.paymentMethod = paymentMethod || subscription.paymentMethod;
    subscription.paymentId = paymentId || subscription.paymentId;
    subscription.autoRenew = true;
    subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    subscription.features = Subscription.getPlanFeatures(subscription.planId);

    await subscription.save();

    // Update user subscription info
    await User.findByIdAndUpdate(userId, {
      subscription: subscription.planId,
      subscriptionExpires: subscription.endDate
    });

    res.json({
      message: 'Subscription reactivated successfully',
      subscription: subscription
    });
  } catch (error) {
    console.error('Reactivate subscription error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check subscription limits
exports.checkLimits = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type } = req.params; // portfolio, testimonials, services, awards

    const subscription = await Subscription.findOne({ 
      userId, 
      status: 'active' 
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    const limitKey = `${type}Limit`;
    const limit = subscription.features[limitKey];

    if (limit === -1) {
      return res.json({ 
        hasLimit: false, 
        limit: -1, 
        message: 'Unlimited' 
      });
    }

    // Get current count
    const Model = require(`../models/${type.charAt(0).toUpperCase() + type.slice(1)}`);
    const currentCount = await Model.countDocuments({ userId });

    const canAdd = currentCount < limit;
    const remaining = limit - currentCount;

    res.json({
      hasLimit: true,
      limit,
      currentCount,
      remaining,
      canAdd,
      message: canAdd ? `${remaining} remaining` : 'Limit reached'
    });
  } catch (error) {
    console.error('Check limits error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};