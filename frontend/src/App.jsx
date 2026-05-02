import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CompanyListPage from './pages/CompanyListPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import JobListPage from './pages/JobListPage';
import JobDetailPage from './pages/JobDetailPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import CompanySetupPage from './pages/CompanySetupPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/companies" element={<CompanyListPage />} />
              <Route path="/companies/:id" element={<CompanyDetailPage />} />
              <Route path="/jobs" element={<JobListPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute><DashboardPage /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute roles={['student']}><ProfilePage /></ProtectedRoute>
              } />
              <Route path="/company-setup" element={
                <ProtectedRoute roles={['company']}><CompanySetupPage /></ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute><ChatPage /></ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
