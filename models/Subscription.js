const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: String,
    required: true,
    enum: ['free', 'premium', 'enterprise']
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'cancelled', 'expired', 'pending'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'bank_transfer', 'free'],
    default: 'free'
  },
  paymentId: {
    type: String,
    sparse: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly', 'lifetime', 'free'],
    default: 'free'
  },
  features: {
    portfolioLimit: {
      type: Number,
      default: 3
    },
    testimonialLimit: {
      type: Number,
      default: 5
    },
    serviceLimit: {
      type: Number,
      default: 3
    },
    awardLimit: {
      type: Number,
      default: 3
    },
    customDomain: {
      type: Boolean,
      default: false
    },
    analytics: {
      type: Boolean,
      default: false
    },
    seoOptimization: {
      type: Boolean,
      default: false
    },
    prioritySupport: {
      type: Boolean,
      default: false
    }
  },
  metadata: {
    upgradeReason: String,
    promoCode: String,
    referralCode: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ endDate: 1 });

// Update timestamp on save
subscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get plan features
subscriptionSchema.statics.getPlanFeatures = function(planId) {
  const plans = {
    free: {
      portfolioLimit: 3,
      testimonialLimit: 5,
      serviceLimit: 3,
      awardLimit: 3,
      customDomain: false,
      analytics: false,
      seoOptimization: false,
      prioritySupport: false
    },
    premium: {
      portfolioLimit: 20,
      testimonialLimit: 20,
      serviceLimit: 10,
      awardLimit: 10,
      customDomain: true,
      analytics: true,
      seoOptimization: true,
      prioritySupport: false
    },
    enterprise: {
      portfolioLimit: -1, // unlimited
      testimonialLimit: -1,
      serviceLimit: -1,
      awardLimit: -1,
      customDomain: true,
      analytics: true,
      seoOptimization: true,
      prioritySupport: true
    }
  };
  
  return plans[planId] || plans.free;
};

// Method to check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && this.endDate > new Date();
};

// Method to check if subscription is expired
subscriptionSchema.methods.isExpired = function() {
  return this.endDate < new Date();
};

module.exports = mongoose.model('Subscription', subscriptionSchema);