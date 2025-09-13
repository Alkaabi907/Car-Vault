import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCar = () => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    licensePlate: '',
    vin: '',
    mileage: 0,
    image: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

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

    if (!formData.make.trim()) {
      newErrors.make = 'Make is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Color is required';
    }

    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'License plate is required';
    }

    if (formData.mileage < 0) {
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

    setLoading(true);
    try {
      await axios.post('/api/cars', formData);
      toast.success('Car added successfully!');
      navigate('/cars');
    } catch (error) {
      console.error('Error adding car:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to add car');
      }
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i + 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Car</h1>
          <p className="text-gray-600 mt-2">Register a new vehicle in your collection</p>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="make" className="form-label">
                    Make <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    className={`form-input ${errors.make ? 'border-red-500' : ''}`}
                    placeholder="e.g., Toyota, Honda, BMW"
                  />
                  {errors.make && <p className="form-error">{errors.make}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="model" className="form-label">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className={`form-input ${errors.model ? 'border-red-500' : ''}`}
                    placeholder="e.g., Camry, Civic, X5"
                  />
                  {errors.model && <p className="form-error">{errors.model}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="year" className="form-label">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className={`form-select ${errors.year ? 'border-red-500' : ''}`}
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.year && <p className="form-error">{errors.year}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="color" className="form-label">
                    Color <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className={`form-input ${errors.color ? 'border-red-500' : ''}`}
                    placeholder="e.g., Red, Blue, Silver"
                  />
                  {errors.color && <p className="form-error">{errors.color}</p>}
                </div>
              </div>

              {/* Identification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="licensePlate" className="form-label">
                    License Plate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="licensePlate"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleChange}
                    className={`form-input ${errors.licensePlate ? 'border-red-500' : ''}`}
                    placeholder="e.g., ABC123"
                    style={{ textTransform: 'uppercase' }}
                  />
                  {errors.licensePlate && <p className="form-error">{errors.licensePlate}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="vin" className="form-label">
                    VIN (Optional)
                  </label>
                  <input
                    type="text"
                    id="vin"
                    name="vin"
                    value={formData.vin}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="17-character VIN"
                    maxLength="17"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
              </div>

              {/* Mileage and Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="mileage" className="form-label">
                    Current Mileage
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

                <div className="form-group">
                  <label htmlFor="image" className="form-label">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
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
                  placeholder="Any additional notes about this car..."
                  rows="3"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner mr-2"></div>
                      Adding Car...
                    </div>
                  ) : (
                    'Add Car'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/cars')}
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

export default AddCar;
