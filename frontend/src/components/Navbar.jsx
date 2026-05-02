import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isStudent, isCompany, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">StuBiz Connect</span>
        </Link>

        <div className="navbar-links">
          <Link to="/companies" className="nav-link">
            <span className="nav-icon">🏢</span> Doanh nghiệp
          </Link>
          <Link to="/jobs" className="nav-link">
            <span className="nav-icon">💼</span> Việc làm
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <span className="nav-icon">📊</span> Dashboard
              </Link>
              {isStudent && (
                <Link to="/profile" className="nav-link">
                  <span className="nav-icon">👤</span> Hồ sơ
                </Link>
              )}
              <Link to="/chat" className="nav-link">
                <span className="nav-icon">💬</span> Chat
              </Link>
              <div className="nav-user">
                <span className="nav-user-name">
                  {user.role === 'student' ? '🎓' : '🏢'} {user.name}
                </span>
                <button onClick={handleLogout} className="btn btn-logout">
                  Đăng xuất
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-outline">Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary">Đăng ký</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
