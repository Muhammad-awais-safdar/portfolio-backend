const mongoose = require('mongoose');

const introFeatureSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  text: {
    type: String,
    required: true
  },
  extraClass: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('IntroFeature', introFeatureSchema);