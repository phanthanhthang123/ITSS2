import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';

const CompanyDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyRes, jobsRes] = await Promise.all([
          api.get(`/companies/${id}`),
          api.get(`/jobs?companyId=${id}`)
        ]);
        setCompany(companyRes.data);
        setJobs(jobsRes.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post('/chat/conversations', {
        participantId: company.userId._id || company.userId
      });
      navigate('/chat', { state: { conversationId: res.data._id } });
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  if (!company) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Không tìm thấy doanh nghiệp</h3>
          <Link to="/companies" className="btn btn-primary">← Quay lại</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/companies" className="back-link">← Quay lại danh sách</Link>

      <div className="detail-page">
        <div className="detail-header">
          <div className="detail-logo">
            {company.logo ? (
              <img src={company.logo} alt={company.name} />
            ) : (
              <span className="company-logo-placeholder large">
                {company.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="detail-info">
            <h1>{company.name}</h1>
            <span className="company-field-badge large">{company.field}</span>
            <div className="detail-meta">
              <span>📍 {company.address}</span>
              {company.employeeCount && <span>👥 {company.employeeCount} nhân viên</span>}
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  🌐 Website
                </a>
              )}
            </div>
          </div>
          {isAuthenticated && user?.role === 'student' && (
            <button onClick={handleStartChat} className="btn btn-primary">
              💬 Nhắn tin
            </button>
          )}
        </div>

        <div className="detail-body">
          <div className="detail-section">
            <h2>Giới thiệu</h2>
            <p>{company.description}</p>
          </div>

          <div className="detail-section">
            <h2>Công nghệ sử dụng</h2>
            <div className="tech-tags-large">
              {company.technologies?.map((tech, i) => (
                <span key={i} className="tech-tag large">{tech}</span>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h2>Vị trí đang tuyển ({jobs.length})</h2>
            {jobs.length > 0 ? (
              <div className="card-grid">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <p className="text-muted">Chưa có vị trí nào đang tuyển</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
