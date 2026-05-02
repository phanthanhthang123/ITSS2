import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CompanySetupPage = () => {
  const { user, isCompany } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    field: '',
    description: '',
    address: '',
    technologies: '',
    website: '',
    logo: '',
    employeeCount: ''
  });

  useEffect(() => {
    // Chỉ company mới được truy cập
    if (!isCompany) {
      navigate('/');
      return;
    }

    const fetchCompanyProfile = async () => {
      try {
        const res = await api.get('/companies/me');
        if (res.data) {
          setCompanyId(res.data._id);
          setFormData({
            name: res.data.name || '',
            field: res.data.field || '',
            description: res.data.description || '',
            address: res.data.address || '',
            technologies: Array.isArray(res.data.technologies) ? res.data.technologies.join(', ') : '',
            website: res.data.website || '',
            logo: res.data.logo || '',
            employeeCount: res.data.employeeCount || ''
          });
        }
      } catch (err) {
        // 404 là bình thường (chưa có profile)
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, [isCompany, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Xử lý mảng technologies
    const techArray = formData.technologies
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const dataToSubmit = {
      ...formData,
      technologies: techArray
    };

    try {
      if (companyId) {
        // Đã có thì update
        await api.put(`/companies/${companyId}`, dataToSubmit);
      } else {
        // Chưa có thì create mới
        await api.post('/companies', dataToSubmit);
      }
      
      // Thành công, quay về dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🏢 Thiết lập thông tin Doanh nghiệp</h1>
        <p>Hoàn thiện hồ sơ để ứng viên hiểu rõ hơn về công ty của bạn</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-card">
          <h2>Thông tin chung</h2>

          <div className="form-group">
            <label>Tên công ty *</label>
            <input
              type="text"
              name="name"
              placeholder="VD: TechVN Solutions"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Lĩnh vực hoạt động *</label>
              <input
                type="text"
                name="field"
                placeholder="VD: IT Outsourcing, E-commerce..."
                value={formData.field}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Quy mô nhân sự</label>
              <select name="employeeCount" value={formData.employeeCount} onChange={handleChange}>
                <option value="">Chọn quy mô...</option>
                <option value="1-10">1-10 nhân viên</option>
                <option value="10-50">10-50 nhân viên</option>
                <option value="50-200">50-200 nhân viên</option>
                <option value="200-500">200-500 nhân viên</option>
                <option value="500+">Trên 500 nhân viên</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Giới thiệu công ty *</label>
            <textarea
              name="description"
              placeholder="Mô tả về môi trường, văn hóa, dự án tiêu biểu..."
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>
        </div>

        <div className="form-card">
          <h2>Liên hệ & Công nghệ</h2>

          <div className="form-group">
            <label>Địa chỉ trụ sở *</label>
            <input
              type="text"
              name="address"
              placeholder="VD: Tòa nhà A, Quận B, TP HCM"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                placeholder="https://company.com"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>URL Logo (tùy chọn)</label>
              <input
                type="url"
                name="logo"
                placeholder="https://link-to-logo.png"
                value={formData.logo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Công nghệ sử dụng chính (ngăn cách bởi dấu phẩy)</label>
            <input
              type="text"
              name="technologies"
              placeholder="VD: React, Node.js, Python, AWS"
              value={formData.technologies}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={saving}>
          {saving ? 'Đang xử lý...' : '💾 Lưu cấu hình Doanh nghiệp'}
        </button>
      </form>
    </div>
  );
};

export default CompanySetupPage;
