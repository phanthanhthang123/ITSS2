import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 Nền tảng kết nối #1 Việt Nam</div>
          <h1 className="hero-title">
            Kết nối <span className="gradient-text">Sinh viên</span> với{' '}
            <span className="gradient-text">Doanh nghiệp</span>
          </h1>
          <p className="hero-subtitle">
            Tìm kiếm cơ hội thực tập, việc làm và dự án từ các doanh nghiệp hàng đầu.
            Xây dựng hồ sơ chuyên nghiệp và giao tiếp trực tiếp với nhà tuyển dụng.
          </p>
          <div className="hero-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  🎓 Bắt đầu ngay
                </Link>
                <Link to="/companies" className="btn btn-outline btn-lg">
                  🏢 Xem doanh nghiệp
                </Link>
              </>
            ) : (
              <>
                <Link to="/jobs" className="btn btn-primary btn-lg">
                  💼 Tìm việc làm
                </Link>
                <Link to="/companies" className="btn btn-outline btn-lg">
                  🏢 Xem doanh nghiệp
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card hero-card-1">
            <span>🎓</span>
            <p>500+ Sinh viên</p>
          </div>
          <div className="hero-card hero-card-2">
            <span>🏢</span>
            <p>100+ Doanh nghiệp</p>
          </div>
          <div className="hero-card hero-card-3">
            <span>💼</span>
            <p>200+ Việc làm</p>
          </div>
          <div className="hero-card hero-card-4">
            <span>💬</span>
            <p>Chat Realtime</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Tính năng nổi bật</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Tìm kiếm thông minh</h3>
            <p>Tìm doanh nghiệp theo lĩnh vực, công nghệ và từ khóa một cách nhanh chóng.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Ứng tuyển dễ dàng</h3>
            <p>Apply vào các vị trí thực tập, việc làm và dự án chỉ với một click.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Hồ sơ chuyên nghiệp</h3>
            <p>Tạo CV và showcase kỹ năng, kinh nghiệm của bạn trước nhà tuyển dụng.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Chat Realtime</h3>
            <p>Trao đổi trực tiếp với doanh nghiệp qua hệ thống tin nhắn realtime.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Sẵn sàng bắt đầu hành trình sự nghiệp?</h2>
          <p>Đăng ký ngay để kết nối với hàng trăm doanh nghiệp hàng đầu</p>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-primary btn-lg">
              Đăng ký miễn phí →
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
