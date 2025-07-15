const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: String,
    required: true,
    trim: true
  },
  occupation: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  nationality: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description1: {
    type: String,
    required: true
  },
  description2: {
    type: String,
    required: true
  },
  signature: {
    type: String,
    required: true
  },
  signatureName: {
    type: String,
    required: true
  },
  signatureTitle: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);