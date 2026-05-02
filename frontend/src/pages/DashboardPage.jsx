import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ApplicationCard from '../components/ApplicationCard';

const DashboardPage = () => {
  const { user, isStudent, isCompany } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Company specific state
  const [companyProfile, setCompanyProfile] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '', description: '', requirements: '',
    technologies: '', type: 'internship', salary: '', location: '', deadline: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appRes = await api.get('/applications');
      setApplications(appRes.data);

      if (isCompany) {
        try {
          const compRes = await api.get('/companies/me');
          setCompanyProfile(compRes.data);
        } catch (e) {
          // No company profile yet
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await api.patch(`/applications/${applicationId}`, { status });
      // Refresh
      const appRes = await api.get('/applications');
      setApplications(appRes.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...jobForm,
        requirements: jobForm.requirements.split(',').map(s => s.trim()).filter(Boolean),
        technologies: jobForm.technologies.split(',').map(s => s.trim()).filter(Boolean),
        deadline: jobForm.deadline || undefined
      };
      await api.post('/jobs', data);
      setShowJobForm(false);
      setJobForm({
        title: '', description: '', requirements: '',
        technologies: '', type: 'internship', salary: '', location: '', deadline: ''
      });
      alert('Tạo job thành công! 🎉');
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleStartChat = async (participantId) => {
    try {
      const res = await api.post('/chat/conversations', { participantId });
      navigate('/chat', { state: { conversationId: res.data._id } });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  const pendingApps = applications.filter(a => a.status === 'pending');
  const acceptedApps = applications.filter(a => a.status === 'accepted');
  const rejectedApps = applications.filter(a => a.status === 'rejected');

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Dashboard</h1>
        <p>Xin chào, {user.role === 'student' ? '🎓' : '🏢'} {user.name}</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{applications.length}</span>
          <span className="stat-label">Tổng đơn</span>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-number">{pendingApps.length}</span>
          <span className="stat-label">Đang chờ</span>
        </div>
        <div className="stat-card stat-accepted">
          <span className="stat-number">{acceptedApps.length}</span>
          <span className="stat-label">Đã chấp nhận</span>
        </div>
        <div className="stat-card stat-rejected">
          <span className="stat-number">{rejectedApps.length}</span>
          <span className="stat-label">Đã từ chối</span>
        </div>
      </div>

      {/* Company: Create Job Button */}
      {isCompany && (
        <div className="dashboard-actions">
          {!companyProfile && (
            <div className="alert alert-warning">
              ⚠️ Bạn chưa tạo company profile.{' '}
              <button className="btn btn-link" onClick={() => navigate('/company-setup')}>
                Tạo ngay
              </button>
            </div>
          )}
          <button className="btn btn-primary" onClick={() => setShowJobForm(!showJobForm)}>
            {showJobForm ? '✕ Đóng' : '➕ Đăng việc mới'}
          </button>
        </div>
      )}

      {/* Job Form for Company */}
      {showJobForm && (
        <div className="form-card">
          <h2>➕ Đăng việc làm mới</h2>
          <form onSubmit={handleCreateJob}>
            <div className="form-group">
              <label>Tiêu đề *</label>
              <input type="text" value={jobForm.title}
                onChange={e => setJobForm({...jobForm, title: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Mô tả *</label>
              <textarea value={jobForm.description} rows={4}
                onChange={e => setJobForm({...jobForm, description: e.target.value})} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Yêu cầu (phân cách bằng dấu phẩy)</label>
                <input type="text" value={jobForm.requirements}
                  placeholder="React, 1 năm kinh nghiệm, Tiếng Anh"
                  onChange={e => setJobForm({...jobForm, requirements: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Công nghệ (phân cách bằng dấu phẩy)</label>
                <input type="text" value={jobForm.technologies}
                  placeholder="React, Node.js, MongoDB"
                  onChange={e => setJobForm({...jobForm, technologies: e.target.value})} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Loại</label>
                <select value={jobForm.type}
                  onChange={e => setJobForm({...jobForm, type: e.target.value})}>
                  <option value="internship">Thực tập</option>
                  <option value="fulltime">Toàn thời gian</option>
                  <option value="parttime">Bán thời gian</option>
                  <option value="project">Dự án</option>
                </select>
              </div>
              <div className="form-group">
                <label>Lương</label>
                <input type="text" value={jobForm.salary}
                  placeholder="10-15 triệu/tháng"
                  onChange={e => setJobForm({...jobForm, salary: e.target.value})} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Địa điểm</label>
                <input type="text" value={jobForm.location}
                  placeholder="Hà Nội / Remote"
                  onChange={e => setJobForm({...jobForm, location: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Hạn nộp</label>
                <input type="date" value={jobForm.deadline}
                  onChange={e => setJobForm({...jobForm, deadline: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">🚀 Đăng việc</button>
          </form>
        </div>
      )}

      {/* Applications List */}
      <div className="dashboard-section">
        <h2>{isStudent ? '📋 Đơn ứng tuyển của bạn' : '📋 Đơn ứng tuyển nhận được'}</h2>
        {applications.length === 0 ? (
          <div className="empty-state small">
            <p>{isStudent
              ? 'Bạn chưa ứng tuyển vị trí nào. '
              : 'Chưa có đơn ứng tuyển nào. '}
            </p>
            {isStudent && <Link to="/jobs" className="btn btn-primary">Tìm việc ngay →</Link>}
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((app) => (
              <ApplicationCard
                key={app._id}
                application={app}
                isCompany={isCompany}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
