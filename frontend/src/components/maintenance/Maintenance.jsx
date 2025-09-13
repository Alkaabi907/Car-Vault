import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Icon from '../icons/Icon';

const Maintenance = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/maintenance');
      setMaintenance(response.data);
    } catch (error) {
      console.error('Error fetching maintenance:', error);
      toast.error('Failed to load maintenance records');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (maintenanceId, description) => {
    if (window.confirm(`Are you sure you want to delete "${description}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`/api/maintenance/${maintenanceId}`);
        setMaintenance(maintenance.filter(record => record._id !== maintenanceId));
        toast.success('Maintenance record deleted successfully');
      } catch (error) {
        console.error('Error deleting maintenance:', error);
        toast.error('Failed to delete maintenance record');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      'Oil Change': 'badge-primary',
      'Tire Rotation': 'badge-success',
      'Brake Service': 'badge-warning',
      'Engine Service': 'badge-danger',
      'Transmission': 'badge-primary',
      'Other': 'badge-secondary'
    };
    return colors[type] || 'badge-secondary';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Oil Change': 'maintenance',
      'Tire Rotation': 'tires',
      'Brake Service': 'repairs',
      'Engine Service': 'repairs',
      'Transmission': 'parts',
      'Other': 'maintenance'
    };
    return icons[type] || 'maintenance';
  };

  const filteredMaintenance = maintenance.filter(record => {
    if (filter === 'all') return true;
    return record.type === filter;
  });

  const maintenanceTypes = ['Oil Change', 'Tire Rotation', 'Brake Service', 'Engine Service', 'Transmission', 'Other'];

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Records</h1>
          <p className="text-gray-600 mt-2">Track your car maintenance history</p>
        </div>
        <Link
          to="/maintenance/add"
          className="btn btn-primary mt-4 sm:mt-0"
        >
          <Icon name="add" size={20} />
          Add Maintenance
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            All ({maintenance.length})
          </button>
          {maintenanceTypes.map(type => {
            const count = maintenance.filter(record => record.type === type).length;
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`btn btn-sm ${filter === type ? 'btn-primary' : 'btn-outline'}`}
              >
                <Icon name={getTypeIcon(type)} size={16} />
                {type} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Maintenance Records */}
      {filteredMaintenance.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icon name="maintenance" size={64} color="rgba(255, 255, 255, 0.5)" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No maintenance records yet' : `No ${filter} records`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'Start tracking your car maintenance by adding your first record.'
              : `No ${filter} maintenance records found.`
            }
          </p>
          <Link to="/maintenance/add" className="btn btn-primary">
            Add Maintenance Record
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMaintenance.map((record) => (
            <div key={record._id} className="card hover:shadow-md transition-shadow">
              <div className="card-body">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon name={getTypeIcon(record.type)} size={20} />
                      <span className={`badge ${getTypeColor(record.type)}`}>
                        {record.type}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {record.car?.make} {record.car?.model}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {record.car?.licensePlate}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-2">{record.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Icon name="calendar" size={16} />
                        {formatDate(record.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="mileage" size={16} />
                        {record.mileage.toLocaleString()} miles
                      </span>
                      {record.location && (
                        <span className="flex items-center gap-1">
                          <Icon name="location" size={16} />
                          {record.location}
                        </span>
                      )}
                    </div>

                    {record.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">"{record.notes}"</p>
                    )}

                    {record.nextServiceDate && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                          <strong>Next Service:</strong> {formatDate(record.nextServiceDate)}
                          {record.nextServiceMileage && ` • ${record.nextServiceMileage.toLocaleString()} miles`}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end mt-4 lg:mt-0 lg:ml-6">
                    <div className="text-right mb-3">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(record.cost)}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={`/maintenance/${record._id}/edit`}
                        className="btn btn-outline btn-sm"
                      >
                        <Icon name="edit" size={16} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(record._id, record.description)}
                        className="btn btn-danger btn-sm"
                      >
                        <Icon name="delete" size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Maintenance;
