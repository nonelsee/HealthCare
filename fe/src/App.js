import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import ChatBox from "./components/ChatBox";

// Auth components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';

// Doctor components
import CreateSchedule from './components/Doctor/CreateSchedule';
import DoctorScheduleList from './components/Doctor/DoctorScheduleList';
import DoctorAppointments from './components/Doctor/DoctorAppointments';

// Patient components
import DoctorList from './components/Patient/DoctorList';
import BookAppointment from './components/Patient/BookAppointment';
import PatientAppointments from './components/Patient/PatientAppointments';

import authService from './services/auth.service';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Auth handlers
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsChatOpen(false); // Close chat when logout
  };

  // Chat handlers
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, requireAuth = true, requireDoctor = false, requirePatient = false }) => {
    if (!requireAuth) return children;
    
    if (!isLoggedIn) return <Navigate to="/" />;
    
    if (requireDoctor && !currentUser?.is_doctor) return <Navigate to="/dashboard" />;
    if (requirePatient && !currentUser?.is_patient) return <Navigate to="/dashboard" />;
    
    return children;
  };

  // Dashboard Wrapper Component
  const DashboardWrapper = ({ content }) => (
    <Dashboard 
      user={currentUser} 
      onLogout={handleLogout}
      content={content}
    />
  );

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Auth Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute requireAuth={false}>
                {!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Register />
              </ProtectedRoute>
            } 
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardWrapper />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor/create-schedule"
            element={
              <ProtectedRoute requireDoctor={true}>
                <DashboardWrapper content={<CreateSchedule />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/schedules"
            element={
              <ProtectedRoute requireDoctor={true}>
                <DashboardWrapper content={<DoctorScheduleList />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute requireDoctor={true}>
                <DashboardWrapper content={<DoctorAppointments />} />
              </ProtectedRoute>
            }
          />

          {/* Patient Routes */}
          <Route
            path="/find-doctors"
            element={
              <ProtectedRoute requirePatient={true}>
                <DashboardWrapper content={<DoctorList />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-appointment/:doctorId"
            element={
              <ProtectedRoute requirePatient={true}>
                <DashboardWrapper content={<BookAppointment />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute requirePatient={true}>
                <DashboardWrapper content={<PatientAppointments />} />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* AI Chat Component - Only show when logged in */}
        {isLoggedIn && (
          <>
            {/* Chat Toggle Button - Sử dụng emoji thay vì FontAwesome */}
            <button 
              className={`chat-toggle-btn ${isChatOpen ? 'active' : ''}`}
              onClick={toggleChat}
              aria-label="Toggle AI Chat"
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 1000,
                border: 'none',
                outline: 'none'
              }}
            >
              {/* Sử dụng emoji hoặc text thay vì FontAwesome icons */}
              {isChatOpen ? '✕' : '💬'}
            </button>

            {/* Chat Container */}
            <div 
              className={`chat-container ${isChatOpen ? 'open' : 'closed'}`}
              style={{
                position: 'fixed',
                bottom: '100px',
                right: '24px',
                zIndex: 999
              }}
            >
              <ChatBox 
                isOpen={isChatOpen}
                onClose={closeChat}
                user={currentUser}
              />
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;