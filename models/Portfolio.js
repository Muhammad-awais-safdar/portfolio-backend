const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  image: String,
  category: {
    type: String,
    required: true,
    trim: true
  },
  client: {
    type: String,
    trim: true
  },
  projectUrl: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  technologies: [String],
  features: [String],
  challenges: String,
  solutions: String,
  results: String,
  duration: String,
  teamSize: Number,
  role: String,
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'completed'
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
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

// Update timestamp on save
portfolioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
portfolioSchema.index({ userId: 1, order: 1 });
portfolioSchema.index({ userId: 1, featured: -1 });
portfolioSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Portfolio', portfolioSchema);