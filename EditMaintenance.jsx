import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditMaintenance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    car: '',
    type: 'Oil Change',
    description: '',
    date: new Date().toISOString().split('T')[0],
    mileage: 0,
    cost: 0,
    location: '',
    nextServiceDate: '',
    nextServiceMileage: '',
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
      const [maintenanceRes, carsRes] = await Promise.all([
        axios.get(`/api/maintenance/${id}`),
        axios.get('/api/cars')
      ]);

      const maintenance = maintenanceRes.data;
      setCars(carsRes.data);

      setFormData({
        car: maintenance.car._id,
        type: maintenance.type,
        description: maintenance.description || '',
        date: new Date(maintenance.date).toISOString().split('T')[0],
        mileage: maintenance.mileage || 0,
        cost: maintenance.cost || 0,
        location: maintenance.location || '',
        nextServiceDate: maintenance.nextServiceDate ? new Date(maintenance.nextServiceDate).toISOString().split('T')[0] : '',
        nextServiceMileage: maintenance.nextServiceMileage || '',
        receipt: maintenance.receipt || '',
        notes: maintenance.notes || ''
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load maintenance record');
      navigate('/maintenance');
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

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.mileage < 0) {
      newErrors.mileage = 'Mileage cannot be negative';
    }

    if (formData.cost < 0) {
      newErrors.cost = 'Cost cannot be negative';
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
        nextServiceDate: formData.nextServiceDate || undefined,
        nextServiceMileage: formData.nextServiceMileage || undefined
      };
      
      await axios.put(`/api/maintenance/${id}`, submitData);
      toast.success('Maintenance record updated successfully!');
      navigate('/maintenance');
    } catch (error) {
      console.error('Error updating maintenance:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update maintenance record');
      }
    } finally {
      setSaving(false);
    }
  };

  const maintenanceTypes = [
    'Oil Change',
    'Tire Rotation', 
    'Brake Service',
    'Engine Service',
    'Transmission',
    'Other'
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Maintenance Record</h1>
          <p className="text-gray-600 mt-2">Update maintenance information</p>
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

              {/* Maintenance Type and Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="type" className="form-label">
                    Maintenance Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {maintenanceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="cost" className="form-label">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    className={`form-input ${errors.cost ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.cost && <p className="form-error">{errors.cost}</p>}
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
                  placeholder="Describe what was done during this maintenance..."
                  rows="3"
                />
                {errors.description && <p className="form-error">{errors.description}</p>}
              </div>

              {/* Date and Mileage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="date" className="form-label">
                    Service Date <span className="text-red-500">*</span>
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
                    Mileage at Service
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
                    Service Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Auto Shop, Dealership"
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

              {/* Next Service */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="nextServiceDate" className="form-label">
                    Next Service Date (Optional)
                  </label>
                  <input
                    type="date"
                    id="nextServiceDate"
                    name="nextServiceDate"
                    value={formData.nextServiceDate}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nextServiceMileage" className="form-label">
                    Next Service Mileage (Optional)
                  </label>
                  <input
                    type="number"
                    id="nextServiceMileage"
                    name="nextServiceMileage"
                    value={formData.nextServiceMileage}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0"
                    min="0"
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
                  placeholder="Any additional notes about this maintenance..."
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
                      Updating Maintenance...
                    </div>
                  ) : (
                    'Update Maintenance Record'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/maintenance')}
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

export default EditMaintenance;
