const mongoose = require('mongoose');

const funFactSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true
  },
  suffix: {
    type: String,
    default: ''
  },
  label: {
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

module.exports = mongoose.model('FunFact', funFactSchema);