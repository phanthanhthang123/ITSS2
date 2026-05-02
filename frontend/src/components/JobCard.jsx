import { Link } from 'react-router-dom';

const typeLabels = {
  internship: 'Thực tập',
  fulltime: 'Toàn thời gian',
  parttime: 'Bán thời gian',
  project: 'Dự án'
};

const typeColors = {
  internship: 'type-intern',
  fulltime: 'type-full',
  parttime: 'type-part',
  project: 'type-project'
};

const JobCard = ({ job }) => {
  const deadlineStr = job.deadline
    ? new Date(job.deadline).toLocaleDateString('vi-VN')
    : null;

  return (
    <Link to={`/jobs/${job._id}`} className="job-card">
      <div className="job-card-header">
        <div className="job-title-wrap">
          <h3 className="job-title">{job.title}</h3>
          <span className={`job-type-badge ${typeColors[job.type]}`}>
            {typeLabels[job.type] || job.type}
          </span>
        </div>
        {job.companyId && (
          <p className="job-company">
            🏢 {job.companyId.name}
            {job.companyId.field && <span className="job-field"> · {job.companyId.field}</span>}
          </p>
        )}
      </div>

      <p className="job-description">
        {job.description?.length > 150
          ? job.description.substring(0, 150) + '...'
          : job.description}
      </p>

      <div className="job-meta">
        <span className="meta-item">💰 {job.salary || 'Thỏa thuận'}</span>
        {job.location && <span className="meta-item">📍 {job.location}</span>}
        {deadlineStr && <span className="meta-item">⏰ {deadlineStr}</span>}
      </div>

      <div className="job-techs">
        {job.technologies?.slice(0, 4).map((tech, i) => (
          <span key={i} className="tech-tag">{tech}</span>
        ))}
        {job.technologies?.length > 4 && (
          <span className="tech-tag tech-more">+{job.technologies.length - 4}</span>
        )}
      </div>
    </Link>
  );
};

export default JobCard;
