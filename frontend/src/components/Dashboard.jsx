import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Icon from './icons/Icon';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalMaintenance: 0,
    totalExpenses: 0,
    recentMaintenance: [],
    recentExpenses: []
  });
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [carsRes, maintenanceRes, expensesRes] = await Promise.all([
        axios.get('/api/cars'),
        axios.get('/api/maintenance'),
        axios.get('/api/expenses')
      ]);

      const cars = carsRes.data;
      const maintenance = maintenanceRes.data;
      const expenses = expensesRes.data;
      const totalExpenses = maintenance.reduce((sum, maintenance) => sum + maintenance.cost, 0);
      const recentMaintenance = maintenance
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      const recentExpenses = expenses
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setStats({
        totalCars: cars.length,
        totalMaintenance: maintenance.length,
        totalExpenses: totalExpenses,
        recentMaintenance,
        recentExpenses
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'transparent'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '3rem',
          borderRadius: '2rem',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: '500',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}>
            Loading your amazing dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
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
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
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
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
        zIndex: -1
      }}></div>

      <div className="container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Hero Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2rem',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '2rem',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              marginBottom: '1rem',
              letterSpacing: '-0.025em'
            }}>
              Welcome to CarVault
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '500',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}>
              Your premium car collection manager with stunning visuals
            </p>
          </div>
        </div>

        {/* Stats Cards with 3D Effects */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {[
            {
              title: 'Total Cars',
              value: stats.totalCars,
              icon: 'car',
              gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              hoverGradient: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
            },
            {
              title: 'Maintenance Records',
              value: stats.totalMaintenance,
              icon: 'maintenance',
              gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              hoverGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
            },
            {
              title: 'Total Expenses',
              value: formatCurrency(stats.totalExpenses),
              icon: 'money',
              gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              hoverGradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className="card"
              style={{
                background: stat.gradient,
                transform: hoveredCard === index ? 'translateY(-12px) rotateX(5deg) scale(1.05)' : 'translateY(0) rotateX(0) scale(1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                perspective: '1000px',
                cursor: 'pointer'
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{ padding: '2rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}>
                    <Icon name={stat.icon} size={32} color="white" />
                  </div>
                  <div>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.5rem'
                    }}>
                      {stat.title}
                    </p>
                    <p style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      color: 'white',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      lineHeight: '1'
                    }}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions with Hover Effects */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {[
            {
              title: 'Add New Car',
              description: 'Register a stunning vehicle to your collection',
              icon: 'car',
              link: '/cars/add',
              gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              hoverIcon: 'add'
            },
            {
              title: 'Log Maintenance',
              description: 'Record service history and keep cars perfect',
              icon: 'maintenance',
              link: '/maintenance/add',
              gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              hoverIcon: 'add'
            },
            {
              title: 'Track Expenses',
              description: 'Monitor fuel, insurance, and all costs',
              icon: 'money',
              link: '/expenses/add',
              gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              hoverIcon: 'chart'
            },
            {
              title: 'View Collection',
              description: 'Browse your entire car collection',
              icon: 'car',
              link: '/cars',
              gradient: 'linear-gradient(135deg, #ec4899 0%, #ef4444 100%)',
              hoverIcon: 'arrowRight'
            }
          ].map((action, index) => (
            <Link
              key={index}
              to={action.link}
              style={{
                textDecoration: 'none',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '1.5rem',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.background = action.gradient;
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                padding: '2.5rem',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  marginBottom: '1.5rem',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Icon name={action.icon} size={64} color="white" />
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '0.75rem',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  {action.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.5',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}>
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity with Glass Effect */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem'
        }}>
          {/* Recent Maintenance */}
          <div className="card" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              padding: '2rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Icon name="maintenance" size={24} color="white" />
                  Recent Maintenance
                </h3>
                <Link
                  to="/maintenance"
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                  }}
                >
                  View all
                </Link>
              </div>
            </div>
            <div style={{ padding: '2rem' }}>
              {stats.recentMaintenance.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  <div style={{
                    marginBottom: '1rem',
                    animation: 'float 3s ease-in-out infinite',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <Icon name="maintenance" size={48} color="rgba(255, 255, 255, 0.7)" />
                  </div>
                  <p style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>No maintenance records yet</p>
                  <Link to="/maintenance/add" className="btn btn-primary">
                    Add Maintenance
                  </Link>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  {stats.recentMaintenance.map((record, index) => (
                    <div key={record._id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                    >
                      <div>
                        <p style={{
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '0.25rem',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                        }}>
                          {record.type}
                        </p>
                        <p style={{
                          fontSize: '0.875rem',
                          color: 'rgba(255, 255, 255, 0.7)'
                        }}>
                          {record.car?.make} {record.car?.model}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '0.25rem',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                        }}>
                          {formatCurrency(record.cost)}
                        </p>
                        <p style={{
                          fontSize: '0.875rem',
                          color: 'rgba(255, 255, 255, 0.7)'
                        }}>
                          {formatDate(record.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="card" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              padding: '2rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Icon name="money" size={24} color="white" />
                  Recent Expenses
                </h3>
                <Link
                  to="/expenses"
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                  }}
                >
                  View all
                </Link>
              </div>
            </div>
            <div style={{ padding: '2rem' }}>
              {stats.recentExpenses.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  <div style={{
                    marginBottom: '1rem',
                    animation: 'float 3s ease-in-out infinite',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <Icon name="money" size={48} color="rgba(255, 255, 255, 0.7)" />
                  </div>
                  <p style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>No expenses recorded yet</p>
                  <Link to="/expenses/add" className="btn btn-primary">
                    Add Expense
                  </Link>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  {stats.recentExpenses.map((expense, index) => (
                    <div key={expense._id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                    >
                      <div>
                        <p style={{
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '0.25rem',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                        }}>
                          {expense.category}
                        </p>
                        <p style={{
                          fontSize: '0.875rem',
                          color: 'rgba(255, 255, 255, 0.7)'
                        }}>
                          {expense.car?.make} {expense.car?.model}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '0.25rem',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                        }}>
                          {formatCurrency(expense.amount)}
                        </p>
                        <p style={{
                          fontSize: '0.875rem',
                          color: 'rgba(255, 255, 255, 0.7)'
                        }}>
                          {formatDate(expense.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;