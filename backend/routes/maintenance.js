const express = require('express');
const { body, validationResult } = require('express-validator');
const Maintenance = require('../models/Maintenance');
const Car = require('../models/Car');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all maintenance records for user's cars
router.get('/', auth, async (req, res) => {
  try {
    const maintenance = await Maintenance.find({ user: req.user._id })
      .populate('car', 'make model year licensePlate')
      .sort({ date: -1 });
    res.json(maintenance);
  } catch (error) {
    console.error('Get maintenance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get maintenance records for specific car
router.get('/car/:carId', auth, async (req, res) => {
  try {
    // Verify car belongs to user
    const car = await Car.findOne({ _id: req.params.carId, user: req.user._id });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const maintenance = await Maintenance.find({ car: req.params.carId })
      .populate('car', 'make model year licensePlate')
      .sort({ date: -1 });
    res.json(maintenance);
  } catch (error) {
    console.error('Get car maintenance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single maintenance record
router.get('/:id', auth, async (req, res) => {
  try {
    const maintenance = await Maintenance.findOne({ _id: req.params.id, user: req.user._id })
      .populate('car', 'make model year licensePlate');
    
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    res.json(maintenance);
  } catch (error) {
    console.error('Get maintenance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new maintenance record
router.post('/', [
  auth,
  body('car').isMongoId().withMessage('Valid car ID is required'),
  body('type').isIn(['Oil Change', 'Tire Rotation', 'Brake Service', 'Engine Service', 'Transmission', 'Other']).withMessage('Valid maintenance type is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('mileage').isInt({ min: 0 }).withMessage('Mileage must be a positive number'),
  body('cost').isFloat({ min: 0 }).withMessage('Cost must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { car, type, description, date, mileage, cost, location, nextServiceDate, nextServiceMileage, receipt, notes } = req.body;

    // Verify car belongs to user
    const carDoc = await Car.findOne({ _id: car, user: req.user._id });
    if (!carDoc) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const maintenance = new Maintenance({
      car,
      user: req.user._id,
      type,
      description,
      date: new Date(date),
      mileage,
      cost,
      location,
      nextServiceDate: nextServiceDate ? new Date(nextServiceDate) : undefined,
      nextServiceMileage,
      receipt: receipt || '',
      notes
    });

    await maintenance.save();
    await maintenance.populate('car', 'make model year licensePlate');
    res.status(201).json(maintenance);
  } catch (error) {
    console.error('Create maintenance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update maintenance record
router.put('/:id', [
  auth,
  body('type').optional().isIn(['Oil Change', 'Tire Rotation', 'Brake Service', 'Engine Service', 'Transmission', 'Other']).withMessage('Valid maintenance type is required'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('mileage').optional().isInt({ min: 0 }).withMessage('Mileage must be a positive number'),
  body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const maintenance = await Maintenance.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    const { type, description, date, mileage, cost, location, nextServiceDate, nextServiceMileage, receipt, notes } = req.body;

    // Update fields
    if (type) maintenance.type = type;
    if (description) maintenance.description = description;
    if (date) maintenance.date = new Date(date);
    if (mileage !== undefined) maintenance.mileage = mileage;
    if (cost !== undefined) maintenance.cost = cost;
    if (location !== undefined) maintenance.location = location;
    if (nextServiceDate !== undefined) maintenance.nextServiceDate = nextServiceDate ? new Date(nextServiceDate) : undefined;
    if (nextServiceMileage !== undefined) maintenance.nextServiceMileage = nextServiceMileage;
    if (receipt !== undefined) maintenance.receipt = receipt;
    if (notes !== undefined) maintenance.notes = notes;

    await maintenance.save();
    await maintenance.populate('car', 'make model year licensePlate');
    res.json(maintenance);
  } catch (error) {
    console.error('Update maintenance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete maintenance record
router.delete('/:id', auth, async (req, res) => {
  try {
    const maintenance = await Maintenance.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    await Maintenance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    console.error('Delete maintenance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
