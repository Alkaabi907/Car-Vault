import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    car: '',
    category: 'Fuel',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    mileage: '',
    location: '',
    receipt: '',
    notes: ''
  });
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [expenseRes, carsRes] = await Promise.all([
        axios.get(`/api/expenses/${id}`),
        axios.get('/api/cars')
      ]);

      const expense = expenseRes.data;
      setCars(carsRes.data);

      setFormData({
        car: expense.car._id,
        category: expense.category,
        description: expense.description || '',
        amount: expense.amount || 0,
        date: new Date(expense.date).toISOString().split('T')[0],
        mileage: expense.mileage || '',
        location: expense.location || '',
        receipt: expense.receipt || '',
        notes: expense.notes || ''
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load expense');
      navigate('/expenses');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.car) {
      newErrors.car = 'Please select a car';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.mileage && formData.mileage < 0) {
      newErrors.mileage = 'Mileage cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const submitData = {
        ...formData,
        mileage: formData.mileage || undefined
      };
      
      await axios.put(`/api/expenses/${id}`, submitData);
      toast.success('Expense updated successfully!');
      navigate('/expenses');
    } catch (error) {
      console.error('Error updating expense:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update expense');
      }
    } finally {
      setSaving(false);
    }
  };

  const expenseCategories = [
    'Fuel',
    'Insurance',
    'Registration',
    'Repairs',
    'Parts',
    'Tires',
    'Other'
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      'Fuel': '⛽',
      'Insurance': '🛡️',
      'Registration': '📋',
      'Repairs': '🔧',
      'Parts': '🔩',
      'Tires': '🛞',
      'Other': '💰'
    };
    return icons[category] || '💰';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Expense</h1>
          <p className="text-gray-600 mt-2">Update expense information</p>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Car Selection */}
              <div className="form-group">
                <label htmlFor="car" className="form-label">
                  Car <span className="text-red-500">*</span>
                </label>
                <select
                  id="car"
                  name="car"
                  value={formData.car}
                  onChange={handleChange}
                  className={`form-select ${errors.car ? 'border-red-500' : ''}`}
                >
                  <option value="">Select a car</option>
                  {cars.map(car => (
                    <option key={car._id} value={car._id}>
                      {car.make} {car.model} ({car.year}) - {car.licensePlate}
                    </option>
                  ))}
                </select>
                {errors.car && <p className="form-error">{errors.car}</p>}
              </div>

              {/* Category and Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {expenseCategories.map(category => (
                      <option key={category} value={category}>
                        {getCategoryIcon(category)} {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="amount" className="form-label">
                    Amount ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className={`form-input ${errors.amount ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.amount && <p className="form-error">{errors.amount}</p>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`form-textarea ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Describe this expense..."
                  rows="3"
                />
                {errors.description && <p className="form-error">{errors.description}</p>}
              </div>

              {/* Date and Mileage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="date" className="form-label">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`form-input ${errors.date ? 'border-red-500' : ''}`}
                  />
                  {errors.date && <p className="form-error">{errors.date}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="mileage" className="form-label">
                    Mileage (Optional)
                  </label>
                  <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    className={`form-input ${errors.mileage ? 'border-red-500' : ''}`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.mileage && <p className="form-error">{errors.mileage}</p>}
                </div>
              </div>

              {/* Location and Receipt */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Gas Station, Auto Shop"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="receipt" className="form-label">
                    Receipt URL (Optional)
                  </label>
                  <input
                    type="url"
                    id="receipt"
                    name="receipt"
                    value={formData.receipt}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://example.com/receipt.jpg"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="form-group">
                <label htmlFor="notes" className="form-label">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Any additional notes about this expense..."
                  rows="3"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary flex-1"
                >
                  {saving ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner mr-2"></div>
                      Updating Expense...
                    </div>
                  ) : (
                    'Update Expense'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/expenses')}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditExpense;
