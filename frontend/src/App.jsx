import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';

// Components
import Navbar from './components/Navbar.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import Cars from './components/cars/Cars.jsx';
import CarDetail from './components/cars/CarDetail.jsx';
import AddCar from './components/cars/AddCar.jsx';
import EditCar from './components/cars/EditCar.jsx';
import Maintenance from './components/maintenance/Maintenance.jsx';
import AddMaintenance from './components/maintenance/AddMaintenance.jsx';
import EditMaintenance from './components/maintenance/EditMaintenance.jsx';
import Expenses from './components/expenses/Expenses.jsx';
import AddExpense from './components/expenses/AddExpense.jsx';
import EditExpense from './components/expenses/EditExpense.jsx';

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
};

// Main App Content
const AppContent = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            
            {/* Private Routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/cars" 
              element={
                <PrivateRoute>
                  <Cars />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/cars/:id" 
              element={
                <PrivateRoute>
                  <CarDetail />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/cars/add" 
              element={
                <PrivateRoute>
                  <AddCar />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/cars/:id/edit" 
              element={
                <PrivateRoute>
                  <EditCar />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/maintenance" 
              element={
                <PrivateRoute>
                  <Maintenance />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/maintenance/add" 
              element={
                <PrivateRoute>
                  <AddMaintenance />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/maintenance/:id/edit" 
              element={
                <PrivateRoute>
                  <EditMaintenance />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/expenses" 
              element={
                <PrivateRoute>
                  <Expenses />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/expenses/add" 
              element={
                <PrivateRoute>
                  <AddExpense />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/expenses/:id/edit" 
              element={
                <PrivateRoute>
                  <EditExpense />
                </PrivateRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
