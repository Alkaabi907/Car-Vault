import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [maintenance, setMaintenance] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCarDetails = useCallback(async () => {
    try {
      setLoading(true);
      const [carRes, maintenanceRes, expensesRes] = await Promise.all([
        axios.get(`/api/cars/${id}`),
        axios.get(`/api/maintenance/car/${id}`),
        axios.get(`/api/expenses/car/${id}`)
      ]);

      setCar(carRes.data);
      setMaintenance(maintenanceRes.data);
      setExpenses(expensesRes.data);
    } catch (error) {
      console.error('Error fetching car details:', error);
      toast.error('Failed to load car details');
      navigate('/cars');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchCarDetails();
  }, [fetchCarDetails]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${car.make} ${car.model}? This action cannot be undone.`)) {
      try {
        await axios.delete(`/api/cars/${id}`);
        toast.success('Car deleted successfully');
        navigate('/cars');
      } catch (error) {
        console.error('Error deleting car:', error);
        toast.error('Failed to delete car');
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

  const totalMaintenanceCost = maintenance.reduce((sum, record) => sum + record.cost, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h1>
          <Link to="/cars" className="btn btn-primary">
            Back to Cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{car.make} {car.model}</h1>
          <p className="text-gray-600 mt-2">{car.year} • {car.color}</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Link
            to={`/cars/${id}/edit`}
            className="btn btn-outline"
          >
            Edit Car
          </Link>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
          >
            Delete Car
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Car Information */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Car Information</h3>
            </div>
            <div className="card-body">
              {/* Car Image */}
              <div className="mb-6">
                {car.image ? (
                  <img
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-6xl text-gray-400">🚗</div>
                  </div>
                )}
              </div>

              {/* Car Details */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">License Plate:</span>
                  <span className="font-medium">{car.licensePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mileage:</span>
                  <span className="font-medium">{car.mileage.toLocaleString()} miles</span>
                </div>
                {car.vin && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">VIN:</span>
                    <span className="font-medium font-mono text-sm">{car.vin}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Added:</span>
                  <span className="font-medium">{formatDate(car.createdAt)}</span>
                </div>
              </div>

              {car.notes && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-600 text-sm">{car.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card mt-6">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Maintenance Records:</span>
                  <span className="font-medium">{maintenance.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Maintenance Cost:</span>
                  <span className="font-medium">{formatCurrency(totalMaintenanceCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Expenses:</span>
                  <span className="font-medium">{formatCurrency(totalExpenses)}</span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="text-gray-900 font-medium">Total Spent:</span>
                  <span className="font-bold text-lg">{formatCurrency(totalMaintenanceCost + totalExpenses)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance and Expenses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Maintenance */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Maintenance</h3>
                <Link to="/maintenance/add" className="btn btn-primary btn-sm">
                  Add Maintenance
                </Link>
              </div>
            </div>
            <div className="card-body">
              {maintenance.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🔧</div>
                  <p>No maintenance records yet</p>
                  <Link to="/maintenance/add" className="btn btn-primary btn-sm mt-4">
                    Add Maintenance
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {maintenance.slice(0, 5).map((record) => (
                    <div key={record._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{record.type}</p>
                        <p className="text-sm text-gray-600">{record.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(record.date)} • {record.mileage.toLocaleString()} miles</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(record.cost)}</p>
                        {record.location && (
                          <p className="text-xs text-gray-500">{record.location}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {maintenance.length > 5 && (
                    <div className="text-center pt-4">
                      <Link to="/maintenance" className="text-sm text-blue-600 hover:text-blue-500">
                        View all maintenance records
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
                <Link to="/expenses/add" className="btn btn-primary btn-sm">
                  Add Expense
                </Link>
              </div>
            </div>
            <div className="card-body">
              {expenses.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">💰</div>
                  <p>No expenses recorded yet</p>
                  <Link to="/expenses/add" className="btn btn-primary btn-sm mt-4">
                    Add Expense
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses.slice(0, 5).map((expense) => (
                    <div key={expense._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{expense.category}</p>
                        <p className="text-sm text-gray-600">{expense.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(expense.amount)}</p>
                        {expense.location && (
                          <p className="text-xs text-gray-500">{expense.location}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {expenses.length > 5 && (
                    <div className="text-center pt-4">
                      <Link to="/expenses" className="text-sm text-blue-600 hover:text-blue-500">
                        View all expenses
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
