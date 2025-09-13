import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
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

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      background: '#f8fafc'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          padding: '2rem 2rem 1rem'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.5rem'
            }}>
              CV
            </span>
          </div>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '0.5rem'
          }}>
            Welcome Back
          </h2>
          <p style={{
            color: '#64748b',
            fontSize: '1rem',
            marginBottom: '1.5rem'
          }}>
            Sign in to your CarVault account
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b'
          }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: '#2563eb',
                fontWeight: '600',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#2563eb';
              }}
            >
              Create one here
            </Link>
          </p>
        </div>
        
        {/* Form */}
        <div style={{
          padding: '0 2rem 2rem'
        }}>
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                style={{
                  borderColor: errors.email ? '#ef4444' : '#e2e8f0'
                }}
              />
              {errors.email && (
                <p className="form-error">{errors.email}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`form-input ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  borderColor: errors.password ? '#ef4444' : '#e2e8f0'
                }}
              />
              {errors.password && (
                <p className="form-error">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.875rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              {loading ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}>
                  <div className="spinner"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;