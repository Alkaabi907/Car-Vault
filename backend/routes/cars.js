const express = require('express');
const { body, validationResult } = require('express-validator');
const Car = require('../models/Car');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all cars for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const cars = await Car.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single car
router.get('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json(car);
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new car
router.post('/', [
  auth,
  body('make').trim().notEmpty().withMessage('Make is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid year is required'),
  body('color').trim().notEmpty().withMessage('Color is required'),
  body('licensePlate').trim().notEmpty().withMessage('License plate is required'),
  body('mileage').optional().isInt({ min: 0 }).withMessage('Mileage must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { make, model, year, color, licensePlate, vin, mileage, image, notes } = req.body;

    // Check if license plate already exists
    const existingCar = await Car.findOne({ licensePlate: licensePlate.toUpperCase() });
    if (existingCar) {
      return res.status(400).json({ message: 'A car with this license plate already exists' });
    }

    const car = new Car({
      user: req.user._id,
      make,
      model,
      year,
      color,
      licensePlate: licensePlate.toUpperCase(),
      vin: vin?.toUpperCase(),
      mileage: mileage || 0,
      image: image || '',
      notes
    });

    await car.save();
    res.status(201).json(car);
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update car
router.put('/:id', [
  auth,
  body('make').optional().trim().notEmpty().withMessage('Make cannot be empty'),
  body('model').optional().trim().notEmpty().withMessage('Model cannot be empty'),
  body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid year is required'),
  body('color').optional().trim().notEmpty().withMessage('Color cannot be empty'),
  body('licensePlate').optional().trim().notEmpty().withMessage('License plate cannot be empty'),
  body('mileage').optional().isInt({ min: 0 }).withMessage('Mileage must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const car = await Car.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const { make, model, year, color, licensePlate, vin, mileage, image, notes } = req.body;

    // Check if license plate is being changed and if it already exists
    if (licensePlate && licensePlate.toUpperCase() !== car.licensePlate) {
      const existingCar = await Car.findOne({ 
        licensePlate: licensePlate.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (existingCar) {
        return res.status(400).json({ message: 'A car with this license plate already exists' });
      }
    }

    // Update fields
    if (make) car.make = make;
    if (model) car.model = model;
    if (year) car.year = year;
    if (color) car.color = color;
    if (licensePlate) car.licensePlate = licensePlate.toUpperCase();
    if (vin !== undefined) car.vin = vin?.toUpperCase();
    if (mileage !== undefined) car.mileage = mileage;
    if (image !== undefined) car.image = image;
    if (notes !== undefined) car.notes = notes;

    await car.save();
    res.json(car);
  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete car
router.delete('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
