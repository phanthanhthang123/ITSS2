import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const typeLabels = {
  internship: 'Thực tập',
  fulltime: 'Toàn thời gian',
  parttime: 'Bán thời gian',
  project: 'Dự án'
};

const JobDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, isStudent } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      await api.post('/applications', {
        jobId: id,
        coverLetter
      });
      setApplied(true);
      setShowApplyForm(false);
      setMessage('Ứng tuyển thành công! 🎉');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  if (!job) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Không tìm thấy việc làm</h3>
          <Link to="/jobs" className="btn btn-primary">← Quay lại</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/jobs" className="back-link">← Quay lại danh sách</Link>

      <div className="detail-page">
        <div className="detail-header">
          <div className="detail-info">
            <h1>{job.title}</h1>
            <div className="detail-meta">
              {job.companyId && (
                <Link to={`/companies/${job.companyId._id}`} className="detail-company-link">
                  🏢 {job.companyId.name}
                </Link>
              )}
              <span className="job-type-badge">{typeLabels[job.type]}</span>
              <span>💰 {job.salary}</span>
              {job.location && <span>📍 {job.location}</span>}
              {job.deadline && (
                <span>⏰ Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
              )}
            </div>
          </div>
          {isStudent && !applied && (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setShowApplyForm(!showApplyForm)}
            >
              📝 Ứng tuyển ngay
            </button>
          )}
        </div>

        {message && (
          <div className={`alert ${applied ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        {/* Apply Form */}
        {showApplyForm && (
          <div className="apply-form-container">
            <h3>📝 Thư xin việc</h3>
            <form onSubmit={handleApply}>
              <textarea
                placeholder="Viết thư xin việc của bạn... (không bắt buộc)"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={5}
              />
              <div className="apply-actions">
                <button type="submit" className="btn btn-primary" disabled={applying}>
                  {applying ? 'Đang gửi...' : '🚀 Gửi ứng tuyển'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowApplyForm(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="detail-body">
          <div className="detail-section">
            <h2>Mô tả công việc</h2>
            <p className="whitespace-pre">{job.description}</p>
          </div>

          {job.requirements?.length > 0 && (
            <div className="detail-section">
              <h2>Yêu cầu</h2>
              <ul className="requirements-list">
                {job.requirements.map((req, i) => (
                  <li key={i}>✓ {req}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="detail-section">
            <h2>Công nghệ</h2>
            <div className="tech-tags-large">
              {job.technologies?.map((tech, i) => (
                <span key={i} className="tech-tag large">{tech}</span>
              ))}
            </div>
          </div>

          {job.companyId && (
            <div className="detail-section">
              <h2>Về công ty</h2>
              <div className="company-preview">
                <h3>{job.companyId.name}</h3>
                <p>{job.companyId.description?.substring(0, 200)}...</p>
                <Link to={`/companies/${job.companyId._id}`} className="btn btn-outline">
                  Xem chi tiết công ty →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
