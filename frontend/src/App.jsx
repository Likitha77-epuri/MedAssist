import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Components & Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AIChat from './pages/AIChat';
import SymptomChecker from './pages/SymptomChecker';
import DiseaseSearch from './pages/DiseaseSearch';
import MedicineSearch from './pages/MedicineSearch';
import MedicalReportAnalyzer from './pages/MedicalReportAnalyzer';
import HealthTracker from './pages/HealthTracker';
import AppointmentBooking from './pages/AppointmentBooking';
import Emergency from './pages/Emergency';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes wrapped in Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AIChat />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/symptoms"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SymptomChecker />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/diseases"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DiseaseSearch />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/medicines"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MedicineSearch />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analyzer"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MedicalReportAnalyzer />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracker"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HealthTracker />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AppointmentBooking />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/emergency"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Emergency />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Only Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <Layout>
                      <AdminDashboard />
                    </Layout>
                  </AdminRoute>
                </ProtectedRoute>
              }
            />

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
