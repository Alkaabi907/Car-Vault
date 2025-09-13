import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Icon from '../icons/Icon';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColor, setFilterColor] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cars');
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId, carName) => {
    if (window.confirm(`Are you sure you want to delete ${carName}? This action cannot be undone.`)) {
      try {
        await axios.delete(`/api/cars/${carId}`);
        setCars(cars.filter(car => car._id !== carId));
        toast.success('Car deleted successfully');
      } catch (error) {
        console.error('Error deleting car:', error);
        toast.error('Failed to delete car');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesColor = !filterColor || car.color.toLowerCase() === filterColor.toLowerCase();
    return matchesSearch && matchesColor;
  });

  const uniqueColors = [...new Set(cars.map(car => car.color))];

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        background: '#f8fafc'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
          <p style={{ color: '#64748b' }}>Loading your car collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      padding: '2rem 0',
      position: 'relative'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        zIndex: -1
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
        zIndex: -1
      }}></div>

      <div className="container" style={{
        position: 'relative',
        zIndex: 1
      }}>
        {/* Modern Header */}
        <div className="text-center mb-8">
          <div className="glass-card" style={{
            padding: '2rem',
            marginBottom: '2rem',
            display: 'inline-block'
          }}>
            <h1 className="gradient-text" style={{
              fontSize: '3rem',
              fontWeight: '800',
              marginBottom: '1rem',
              letterSpacing: '-0.025em'
            }}>
              My Car Collection
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '500'
            }}>
              Manage and track your vehicles with style
            </p>
          </div>
        </div>

        {/* Modern Search and Filter */}
        <div className="glass-card mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label" style={{ color: 'white' }}>
                  <Icon name="search" size={16} style={{ marginRight: '0.5rem' }} />
                  Search Cars
                </label>
                <input
                  type="text"
                  placeholder="Search by make, model, or license plate..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#1f2937',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: 'white' }}>
                  <Icon name="car" size={16} style={{ marginRight: '0.5rem' }} />
                  Filter by Color
                </label>
                <select
                  value={filterColor}
                  onChange={(e) => setFilterColor(e.target.value)}
                  className="form-select"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#1f2937',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <option value="">All Colors</option>
                  {uniqueColors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'end' }}>
                <Link
                  to="/cars/add"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Icon name="add" size={20} />
                  Add New Car
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Cars Grid */}
        {filteredCars.length === 0 ? (
          <div className="glass-card text-center" style={{
            padding: '4rem 2rem'
          }}>
            <div className="empty-state-icon">
              <Icon 
                name={searchTerm || filterColor ? 'search' : 'car'} 
                size={80} 
                color="rgba(255, 255, 255, 0.6)" 
              />
            </div>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '1rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              {searchTerm || filterColor ? 'No cars found' : 'No cars yet'}
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '2rem',
              maxWidth: '400px',
              margin: '0 auto 2rem',
              fontSize: '1.125rem'
            }}>
              {searchTerm || filterColor 
                ? 'Try adjusting your search or filter criteria'
                : 'Start building your car collection by adding your first vehicle'
              }
            </p>
            <Link 
              to="/cars/add" 
              className="btn btn-primary"
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              <Icon name="add" size={20} />
              {searchTerm || filterColor ? 'Clear Filters' : 'Add Your First Car'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div key={car._id} className="modern-card animate-slide-up"
                style={{
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-2xl)',
                  boxShadow: 'var(--shadow-xl)',
                  transition: 'all var(--transition-normal)',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                }}
              >
                {/* Modern Car Image */}
                <div style={{
                  height: '220px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {car.image ? (
                    <img
                      src={car.image}
                      alt={`${car.make} ${car.model}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div style={{
                    display: car.image ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <Icon name="car" size={80} color="rgba(255, 255, 255, 0.8)" />
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}>
                      {car.make} {car.model}
                    </p>
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#1f2937',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {car.year}
                  </div>
                </div>

                {/* Modern Car Details */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="gradient-text" style={{
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      marginBottom: '0.5rem'
                    }}>
                      {car.make} {car.model}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: car.color.toLowerCase() === 'red' ? '#ef4444' :
                                   car.color.toLowerCase() === 'blue' ? '#3b82f6' :
                                   car.color.toLowerCase() === 'black' ? '#1f2937' :
                                   car.color.toLowerCase() === 'white' ? '#f3f4f6' :
                                   car.color.toLowerCase() === 'silver' ? '#9ca3af' :
                                   car.color.toLowerCase() === 'gray' ? '#6b7280' :
                                   car.color.toLowerCase() === 'green' ? '#10b981' :
                                   car.color.toLowerCase() === 'yellow' ? '#f59e0b' :
                                   '#94a3b8',
                        border: '3px solid #e2e8f0',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}></div>
                      <span style={{
                        fontSize: '1rem',
                        color: '#64748b',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {car.color}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">
                        <Icon name="car" size={16} style={{ marginRight: '0.5rem' }} />
                        License Plate:
                      </span>
                      <span className="badge badge-primary" style={{
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}>
                        {car.licensePlate}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">
                        <Icon name="mileage" size={16} style={{ marginRight: '0.5rem' }} />
                        Mileage:
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        {car.mileage.toLocaleString()} miles
                      </span>
                    </div>
                    {car.vin && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">
                          <Icon name="car" size={16} style={{ marginRight: '0.5rem' }} />
                          VIN:
                        </span>
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded"
                          style={{
                            maxWidth: '120px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                          {car.vin}
                        </span>
                      </div>
                    )}
                  </div>

                  {car.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {car.notes}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-gray-400 mb-4">
                    Added {formatDate(car.createdAt)}
                  </div>

                  {/* Modern Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/cars/${car._id}`}
                      className="btn btn-primary btn-sm flex-1"
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        color: 'white',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: 'var(--radius-lg)',
                        textDecoration: 'none',
                        transition: 'all var(--transition-normal)'
                      }}
                    >
                      <Icon name="arrowRight" size={16} />
                      View Details
                    </Link>
                    <Link
                      to={`/cars/${car._id}/edit`}
                      className="btn btn-outline btn-sm"
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        color: '#1f2937',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: 'var(--radius-lg)',
                        textDecoration: 'none',
                        transition: 'all var(--transition-normal)'
                      }}
                    >
                      <Icon name="edit" size={16} />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(car._id, `${car.make} ${car.model}`)}
                      className="btn btn-danger btn-sm"
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        color: 'white',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        border: 'none',
                        borderRadius: 'var(--radius-lg)',
                        transition: 'all var(--transition-normal)'
                      }}
                    >
                      <Icon name="delete" size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modern Stats Summary */}
        {cars.length > 0 && (
          <div className="glass-card mt-8">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Collection Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="animate-slide-up">
                  <div className="flex items-center justify-center mb-2">
                    <Icon name="car" size={32} color="rgba(59, 130, 246, 0.8)" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {cars.length}
                  </div>
                  <div className="text-sm text-gray-300 font-medium">
                    Total Cars
                  </div>
                </div>
                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center justify-center mb-2">
                    <Icon name="car" size={32} color="rgba(16, 185, 129, 0.8)" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {uniqueColors.length}
                  </div>
                  <div className="text-sm text-gray-300 font-medium">
                    Different Colors
                  </div>
                </div>
                <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center justify-center mb-2">
                    <Icon name="mileage" size={32} color="rgba(245, 158, 11, 0.8)" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {Math.round(cars.reduce((sum, car) => sum + car.mileage, 0) / cars.length).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-300 font-medium">
                    Avg Mileage
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;