const express = require('express');
const { body, validationResult } = require('express-validator');
const Expense = require('../models/Expense');
const Car = require('../models/Car');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all expenses for user's cars
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .populate('car', 'make model year licensePlate')
      .sort({ date: -1 });
    res.json(expenses);
    
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get expenses for specific car
router.get('/car/:carId', auth, async (req, res) => {
  try {
    // Verify car belongs to user
    const car = await Car.findOne({ _id: req.params.carId, user: req.user._id });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const expenses = await Expense.find({ car: req.params.carId })
      .populate('car', 'make model year licensePlate')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Get car expenses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single expense
router.get('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id })
      .populate('car', 'make model year licensePlate');
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new expense
router.post('/', [
  auth,
  body('car').isMongoId().withMessage('Valid car ID is required'),
  body('category').isIn(['Fuel', 'Insurance', 'Registration', 'Repairs', 'Parts', 'Tires', 'Other']).withMessage('Valid expense category is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('date').isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { car, category, description, amount, date, mileage, location, receipt, notes } = req.body;

    // Verify car belongs to user
    const carDoc = await Car.findOne({ _id: car, user: req.user._id });
    if (!carDoc) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const expense = new Expense({
      car,
      user: req.user._id,
      category,
      description,
      amount,
      date: new Date(date),
      mileage,
      location,
      receipt: receipt || '',
      notes
    });

    await expense.save();
    await expense.populate('car', 'make model year licensePlate');
    res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update expense
router.put('/:id', [
  auth,
  body('category').optional().isIn(['Fuel', 'Insurance', 'Registration', 'Repairs', 'Parts', 'Tires', 'Other']).withMessage('Valid expense category is required'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('date').optional().isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const { category, description, amount, date, mileage, location, receipt, notes } = req.body;

    // Update fields
    if (category) expense.category = category;
    if (description) expense.description = description;
    if (amount !== undefined) expense.amount = amount;
    if (date) expense.date = new Date(date);
    if (mileage !== undefined) expense.mileage = mileage;
    if (location !== undefined) expense.location = location;
    if (receipt !== undefined) expense.receipt = receipt;
    if (notes !== undefined) expense.notes = notes;

    await expense.save();
    await expense.populate('car', 'make model year licensePlate');
    res.json(expense);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get expense summary by category
router.get('/summary/categories', auth, async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);
    res.json(summary);
  } catch (error) {
    console.error('Get expense summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
