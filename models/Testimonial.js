const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true,
    trim: true
  },
  authorTitle: {
    type: String,
    required: true,
    trim: true
  },
  authorImage: {
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

// Index for efficient querying by userId
testimonialSchema.index({ userId: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);