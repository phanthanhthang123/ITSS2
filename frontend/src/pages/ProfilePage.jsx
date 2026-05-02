import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    bio: '',
    skills: [],
    experience: '',
    education: '',
    githubLink: '',
    cvText: '',
    phone: '',
    address: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/me');
        setProfile({
          bio: res.data.bio || '',
          skills: res.data.skills || [],
          experience: res.data.experience || '',
          education: res.data.education || '',
          githubLink: res.data.githubLink || '',
          cvText: res.data.cvText || '',
          phone: res.data.phone || '',
          address: res.data.address || ''
        });
      } catch (error) {
        // Profile chưa tồn tại - OK
        if (error.response?.status !== 404) {
          console.error('Error:', error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await api.post('/profile', profile);
      setMessage('Cập nhật hồ sơ thành công! ✅');
    } catch (error) {
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
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
        <h1>👤 Hồ sơ cá nhân</h1>
        <p>Xây dựng profile ấn tượng để thu hút nhà tuyển dụng</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-card">
          <h2>📋 Thông tin cơ bản</h2>

          <div className="form-group">
            <label>Giới thiệu bản thân</label>
            <textarea
              name="bio"
              placeholder="Viết vài dòng giới thiệu về bạn..."
              value={profile.bio}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phone"
                placeholder="0912345678"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                placeholder="Hà Nội, Việt Nam"
                value={profile.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-card">
          <h2>🛠️ Kỹ năng</h2>

          <div className="skills-input-group">
            <input
              type="text"
              placeholder="Thêm kỹ năng (Enter để thêm)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button type="button" className="btn btn-outline" onClick={addSkill}>+ Thêm</button>
          </div>

          <div className="skills-list">
            {profile.skills.map((skill, i) => (
              <span key={i} className="skill-tag">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-card">
          <h2>🎓 Học vấn & Kinh nghiệm</h2>

          <div className="form-group">
            <label>Học vấn</label>
            <input
              type="text"
              name="education"
              placeholder="Đại học Bách Khoa Hà Nội - CNTT"
              value={profile.education}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Kinh nghiệm</label>
            <textarea
              name="experience"
              placeholder="Mô tả kinh nghiệm làm việc, dự án..."
              value={profile.experience}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>GitHub Link</label>
            <input
              type="url"
              name="githubLink"
              placeholder="https://github.com/username"
              value={profile.githubLink}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-card">
          <h2>📝 CV / Resume</h2>

          <div className="form-group">
            <label>Nội dung CV</label>
            <textarea
              name="cvText"
              placeholder="Viết CV của bạn ở đây..."
              value={profile.cvText}
              onChange={handleChange}
              rows={8}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={saving}>
          {saving ? 'Đang lưu...' : '💾 Lưu hồ sơ'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
