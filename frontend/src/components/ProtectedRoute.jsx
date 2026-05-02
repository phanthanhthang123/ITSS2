import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component bảo vệ route - chỉ cho phép user đã đăng nhập
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Kiểm tra role nếu có yêu cầu
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
