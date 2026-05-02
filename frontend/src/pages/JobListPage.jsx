import { useState, useEffect } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [tech, setTech] = useState('');

  const techs = ['React', 'Node.js', 'Python', 'Java', 'Docker', 'AWS', 'Flutter', 'TypeScript', 'Vue.js'];
  const types = [
    { value: 'internship', label: 'Thực tập' },
    { value: 'fulltime', label: 'Toàn thời gian' },
    { value: 'parttime', label: 'Bán thời gian' },
    { value: 'project', label: 'Dự án' }
  ];

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (keyword) params.keyword = keyword;
      if (type) params.type = type;
      if (tech) params.tech = tech;

      const res = await api.get('/jobs', { params });
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [type, tech]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>💼 Việc làm & Dự án</h1>
        <p>Tìm kiếm cơ hội thực tập, việc làm phù hợp với bạn</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm việc làm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">🔍 Tìm kiếm</button>
        </form>

        <div className="filter-section">
          <div className="filter-group">
            <label>Loại công việc:</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Tất cả</option>
              {types.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Công nghệ:</label>
            <select value={tech} onChange={(e) => setTech(e.target.value)}>
              <option value="">Tất cả</option>
              {techs.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner"></div></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">💼</span>
          <h3>Không tìm thấy việc làm</h3>
          <p>Hãy thử thay đổi bộ lọc</p>
        </div>
      ) : (
        <>
          <p className="result-count">Tìm thấy {jobs.length} vị trí</p>
          <div className="card-grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default JobListPage;
