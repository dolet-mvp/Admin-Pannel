import { useState } from 'react';
import { X, User, AlertTriangle, FileText, Shield, Clock, CheckCircle } from 'lucide-react';
import '../styles/ReportDetailsModal.css';

const ReportDetailsModal = ({ report, onClose, onUpdate }) => {
  const [status, setStatus] = useState(report.status);
  const [actionTaken, setActionTaken] = useState(report.actionTaken || 'none');
  const [adminNotes, setAdminNotes] = useState(report.adminNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onUpdate(report.id, {
        status,
        actionTaken,
        adminNotes,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateId = (id) => {
    if (!id) return '';
    return id.substring(0, 8);
  };

  const getCategoryLabel = (category) => {
    const labels = {
      inappropriate_behavior: 'Inappropriate Behavior',
      fraud: 'Fraud',
      harassment: 'Harassment',
      violence_threat: 'Violence/Threat',
      spam: 'Spam',
      fake_profile: 'Fake Profile',
      payment_issue: 'Payment Issue',
      poor_service: 'Poor Service',
      other: 'Other',
    };
    return labels[category] || category;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content report-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><AlertTriangle size={24} /> Report Details</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="report-info-section">
            <h3><FileText size={20} /> Report Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Report ID:</label>
                <span className="truncate-id" title={report.id}>{truncateId(report.id)}</span>
              </div>
              <div className="info-item">
                <label>Category:</label>
                <span className="category-badge">{getCategoryLabel(report.category)}</span>
              </div>
              <div className="info-item">
                <label>Current Status:</label>
                <span className={`status-badge status-${report.status}`}>
                  {report.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="info-item">
                <label>Submitted:</label>
                <span>{formatDate(report.createdAt)}</span>
              </div>
              {report.taskId && (
                <div className="info-item">
                  <label>Related Task ID:</label>
                  <span className="truncate-id" title={report.taskId}>{truncateId(report.taskId)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="report-description-section">
            <h3><FileText size={20} /> Description</h3>
            <p className="description-text">{report.description}</p>
          </div>

          <div className="users-section">
            <div className="user-card">
              <h3><User size={20} /> Reporter</h3>
              {(report.reporterHelper || report.reporterHelpseeker) ? (
                <div className="user-details">
                  <div className="user-info">
                    <p className="user-name">{(report.reporterHelper || report.reporterHelpseeker).fullName}</p>
                    <p className="user-type">{report.reporterType.toUpperCase()}</p>
                    <p className="user-contact">{(report.reporterHelper || report.reporterHelpseeker).email}</p>
                    <p className="user-contact">{(report.reporterHelper || report.reporterHelpseeker).phone}</p>
                  </div>
                </div>
              ) : (
                <p>Reporter information not available</p>
              )}
            </div>

            <div className="user-card reported-user">
              <h3><Shield size={20} /> Reported User</h3>
              {(report.reportedHelper || report.reportedHelpseeker) ? (
                <div className="user-details">
                  <div className="user-info">
                    <p className="user-name">{(report.reportedHelper || report.reportedHelpseeker).fullName}</p>
                    <p className="user-type">{report.reportedUserType.toUpperCase()}</p>
                    <p className="user-contact">{(report.reportedHelper || report.reportedHelpseeker).email}</p>
                    <p className="user-contact">{(report.reportedHelper || report.reportedHelpseeker).phone}</p>
                  </div>
                </div>
              ) : (
                <p>Reported user information not available</p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="action-form">
            <h3><CheckCircle size={20} /> Take Action</h3>
            
            <div className="form-group">
              <label htmlFor="status">Update Status *</label>
              <select 
                id="status"
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="actionTaken">Action Taken *</label>
              <select 
                id="actionTaken"
                value={actionTaken} 
                onChange={(e) => setActionTaken(e.target.value)}
                required
              >
                <option value="none">None</option>
                <option value="no_action_needed">No Action Needed</option>
                <option value="warning_issued">Warning Issued</option>
                <option value="account_suspended">Account Suspended</option>
                <option value="account_banned">Account Banned</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="adminNotes">Admin Notes</label>
              <textarea 
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about your decision and actions taken..."
                rows={4}
              />
            </div>

            {report.reviewedAt && (
              <div className="review-info">
                <Clock size={16} />
                <span>Last reviewed on {formatDate(report.reviewedAt)}</span>
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
