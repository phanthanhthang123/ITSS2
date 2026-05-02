import { Link } from 'react-router-dom';

const CompanyCard = ({ company }) => {
  return (
    <Link to={`/companies/${company._id}`} className="company-card">
      <div className="company-card-header">
        <div className="company-logo">
          {company.logo ? (
            <img src={company.logo} alt={company.name} />
          ) : (
            <span className="company-logo-placeholder">
              {company.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="company-info">
          <h3 className="company-name">{company.name}</h3>
          <span className="company-field-badge">{company.field}</span>
        </div>
      </div>

      <p className="company-description">
        {company.description?.length > 120
          ? company.description.substring(0, 120) + '...'
          : company.description}
      </p>

      <div className="company-meta">
        <span className="meta-item">
          📍 {company.address}
        </span>
        {company.employeeCount && (
          <span className="meta-item">
            👥 {company.employeeCount}
          </span>
        )}
      </div>

      <div className="company-techs">
        {company.technologies?.slice(0, 5).map((tech, i) => (
          <span key={i} className="tech-tag">{tech}</span>
        ))}
        {company.technologies?.length > 5 && (
          <span className="tech-tag tech-more">+{company.technologies.length - 5}</span>
        )}
      </div>
    </Link>
  );
};

export default CompanyCard;
