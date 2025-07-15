const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
    trim: true
  },
  per: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    label: {
      type: String,
      required: true
    },
    included: {
      type: Boolean,
      required: true
    }
  }],
  aosDuration: {
    type: Number,
    default: 1200
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pricing', pricingSchema);