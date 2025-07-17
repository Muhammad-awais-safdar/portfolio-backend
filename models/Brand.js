const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Brand', brandSchema);