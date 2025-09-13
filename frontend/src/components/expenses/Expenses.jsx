import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Icon from '../icons/Icon';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expenseId, description) => {
    if (window.confirm(`Are you sure you want to delete "${description}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`/api/expenses/${expenseId}`);
        setExpenses(expenses.filter(expense => expense._id !== expenseId));
        toast.success('Expense deleted successfully');
      } catch (error) {
        console.error('Error deleting expense:', error);
        toast.error('Failed to delete expense');
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

  const getCategoryColor = (category) => {
    const colors = {
      'Fuel': 'badge-primary',
      'Insurance': 'badge-success',
      'Registration': 'badge-warning',
      'Repairs': 'badge-danger',
      'Parts': 'badge-primary',
      'Tires': 'badge-secondary',
      'Other': 'badge-secondary'
    };
    return colors[category] || 'badge-secondary';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Fuel': 'fuel',
      'Insurance': 'insurance',
      'Registration': 'registration',
      'Repairs': 'repairs',
      'Parts': 'parts',
      'Tires': 'tires',
      'Other': 'money'
    };
    return icons[category] || 'money';
  };

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'all') return true;
    return expense.category === filter;
  });

  const expenseCategories = ['Fuel', 'Insurance', 'Registration', 'Repairs', 'Parts', 'Tires', 'Other'];

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const filteredTotal = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

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
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-2">Track your car-related expenses</p>
        </div>
        <Link
          to="/expenses/add"
          className="btn btn-primary mt-4 sm:mt-0"
        >
          <Icon name="add" size={20} />
          Add Expense
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Icon name="money" size={32} color="#10b981" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon name="chart" size={32} color="#3b82f6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Filtered Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(filteredTotal)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            All ({expenses.length})
          </button>
          {expenseCategories.map(category => {
            const count = expenses.filter(expense => expense.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`btn btn-sm ${filter === category ? 'btn-primary' : 'btn-outline'}`}
              >
                <Icon name={getCategoryIcon(category)} size={16} />
                {category} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icon name="money" size={64} color="rgba(255, 255, 255, 0.5)" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No expenses recorded yet' : `No ${filter} expenses`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'Start tracking your car expenses by adding your first record.'
              : `No ${filter} expenses found.`
            }
          </p>
          <Link to="/expenses/add" className="btn btn-primary">
            Add Expense
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExpenses.map((expense) => (
            <div key={expense._id} className="card hover:shadow-md transition-shadow">
              <div className="card-body">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon name={getCategoryIcon(expense.category)} size={24} />
                      <span className={`badge ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {expense.car?.make} {expense.car?.model}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {expense.car?.licensePlate}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-2">{expense.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Icon name="calendar" size={16} />
                        {formatDate(expense.date)}
                      </span>
                      {expense.mileage && (
                        <span className="flex items-center gap-1">
                          <Icon name="mileage" size={16} />
                          {expense.mileage.toLocaleString()} miles
                        </span>
                      )}
                      {expense.location && (
                        <span className="flex items-center gap-1">
                          <Icon name="location" size={16} />
                          {expense.location}
                        </span>
                      )}
                    </div>

                    {expense.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">"{expense.notes}"</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end mt-4 lg:mt-0 lg:ml-6">
                    <div className="text-right mb-3">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={`/expenses/${expense._id}/edit`}
                        className="btn btn-outline btn-sm"
                      >
                        <Icon name="edit" size={16} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(expense._id, expense.description)}
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

export default Expenses;
