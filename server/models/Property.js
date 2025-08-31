const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  type: {
    type: String,
    enum: ['apartment', 'house', 'condo', 'townhouse'],
    required: true
  },
  monthlyRent: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['occupied', 'vacant'],
    default: 'vacant'
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  squareFootage: {
    type: Number,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);