import { useState, useEffect } from 'react';
import api from '../services/api';
import CompanyCard from '../components/CompanyCard';

const CompanyListPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [field, setField] = useState('');
  const [tech, setTech] = useState('');

  const fields = ['IT Outsourcing', 'Artificial Intelligence', 'Web Development', 'Data Science', 'Cloud Computing', 'Mobile Development'];
  const techs = ['React', 'Node.js', 'Python', 'Java', 'Docker', 'AWS', 'Flutter', 'Vue.js', 'TypeScript'];

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (keyword) params.keyword = keyword;
      if (field) params.field = field;
      if (tech) params.tech = tech;

      const res = await api.get('/companies', { params });
      setCompanies(res.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [field, tech]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  const clearFilters = () => {
    setKeyword('');
    setField('');
    setTech('');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🏢 Doanh nghiệp</h1>
        <p>Khám phá các doanh nghiệp hàng đầu đang tìm kiếm nhân tài</p>
      </div>

      {/* Search & Filter */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm doanh nghiệp..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">🔍 Tìm kiếm</button>
        </form>

        <div className="filter-section">
          <div className="filter-group">
            <label>Lĩnh vực:</label>
            <select value={field} onChange={(e) => setField(e.target.value)}>
              <option value="">Tất cả</option>
              {fields.map((f) => (
                <option key={f} value={f}>{f}</option>
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

          {(keyword || field || tech) && (
            <button className="btn btn-ghost" onClick={clearFilters}>✕ Xóa bộ lọc</button>
          )}
        </div>
      </div>

      {/* Company Grid */}
      {loading ? (
        <div className="loading-screen"><div className="spinner"></div></div>
      ) : companies.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>Không tìm thấy doanh nghiệp</h3>
          <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <>
          <p className="result-count">Tìm thấy {companies.length} doanh nghiệp</p>
          <div className="card-grid">
            {companies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyListPage;
