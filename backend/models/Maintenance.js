const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Oil Change', 'Tire Rotation', 'Brake Service', 'Engine Service', 'Transmission', 'Other']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  mileage: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    trim: true
  },
  nextServiceDate: {
    type: Date
  },
  nextServiceMileage: {
    type: Number,
    min: 0
  },
  receipt: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
