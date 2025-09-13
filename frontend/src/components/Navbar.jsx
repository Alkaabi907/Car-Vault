import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Icon from './icons/Icon';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/cars', label: 'My Cars', icon: 'car' },
    { path: '/maintenance', label: 'Maintenance', icon: 'maintenance' },
    { path: '/expenses', label: 'Expenses', icon: 'expenses' }
  ];

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Logo */}
        <Link to="/dashboard" style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            color: 'white',
            fontWeight: 'bold'
          }}>
            CV
          </div>
          <span style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#0f172a'
          }}>
            CarVault
          </span>
        </Link>

        {/* Desktop Navigation */}
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  background: isActive(item.path) ? '#2563eb' : 'transparent',
                  color: isActive(item.path) ? 'white' : '#475569'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.color = '#2563eb';
                    e.target.style.background = '#f8fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.color = '#475569';
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* User Menu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {user ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 1rem',
                background: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{
                  color: '#475569',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  color: '#1f2937',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  e.target.style.color = '#1e40af';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  e.target.style.color = '#1f2937';
                }}
              >
                <Icon name="logout" size={16} style={{ marginRight: '0.5rem' }} />
                Logout
              </button>
            </>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <Link 
                to="/login" 
                className="btn btn-outline"
                style={{
                  color: '#1f2937',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  e.target.style.color = '#1e40af';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  e.target.style.color = '#1f2937';
                }}
              >
                <Icon name="user" size={16} style={{ marginRight: '0.5rem' }} />
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                <Icon name="add" size={16} style={{ marginRight: '0.5rem' }} />
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          {user && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                display: 'none',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                color: '#475569',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#0f172a';
                e.target.style.background = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#475569';
                e.target.style.background = 'transparent';
              }}
            >
              <Icon name="menu" size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && isMenuOpen && (
        <div style={{
          borderTop: '1px solid #e2e8f0',
          padding: '1rem 1.5rem',
          background: 'white'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  background: isActive(item.path) ? '#dbeafe' : 'transparent',
                  color: isActive(item.path) ? '#1e40af' : '#475569'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.color = '#0f172a';
                    e.target.style.background = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.color = '#475569';
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
            <div style={{
              paddingTop: '1rem',
              borderTop: '1px solid #e2e8f0',
              marginTop: '0.5rem'
            }}>
              <div style={{
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                color: '#475569'
              }}>
                Welcome, <span style={{ fontWeight: '600', color: '#0f172a' }}>{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  color: '#1f2937',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#1e40af';
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#1f2937';
                  e.target.style.background = 'transparent';
                }}
              >
                <Icon name="logout" size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;