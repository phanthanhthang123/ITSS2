const statusLabels = {
  pending: 'Đang chờ',
  accepted: 'Đã chấp nhận',
  rejected: 'Đã từ chối'
};

const statusColors = {
  pending: 'status-pending',
  accepted: 'status-accepted',
  rejected: 'status-rejected'
};

const ApplicationCard = ({ application, onUpdateStatus, isCompany }) => {
  return (
    <div className="application-card">
      <div className="application-header">
        <div className="application-info">
          <h4 className="application-job-title">
            {application.jobId?.title || 'Job đã bị xóa'}
          </h4>
          {isCompany ? (
            <p className="application-student">
              🎓 {application.studentId?.name} ({application.studentId?.email})
            </p>
          ) : (
            <p className="application-company">
              🏢 {application.jobId?.companyId?.name || 'N/A'}
            </p>
          )}
        </div>
        <span className={`status-badge ${statusColors[application.status]}`}>
          {statusLabels[application.status]}
        </span>
      </div>

      {application.coverLetter && (
        <p className="application-letter">{application.coverLetter}</p>
      )}

      <div className="application-footer">
        <span className="application-date">
          📅 {new Date(application.appliedAt).toLocaleDateString('vi-VN')}
        </span>

        {isCompany && application.status === 'pending' && (
          <div className="application-actions">
            <button
              className="btn btn-accept"
              onClick={() => onUpdateStatus(application._id, 'accepted')}
            >
              ✓ Chấp nhận
            </button>
            <button
              className="btn btn-reject"
              onClick={() => onUpdateStatus(application._id, 'rejected')}
            >
              ✗ Từ chối
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
