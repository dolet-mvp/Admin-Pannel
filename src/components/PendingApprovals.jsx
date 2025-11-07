import { useState, useEffect } from 'react';
import { Check, X, Phone, Calendar, FileText, AlertTriangle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SkeletonCard from './SkeletonCard';
import '../styles/PendingApprovals.css';

const PendingApprovals = () => {
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [docsVerified, setDocsVerified] = useState(false);

  useEffect(() => {
    fetchPendingHelpers();
  }, []);

  const fetchPendingHelpers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/helpers/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setHelpers(data.helpers);
      }
    } catch (error) {
      console.error('Error fetching pending helpers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/helpers/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setHelpers(helpers.filter(helper => helper.id !== id));
        setShowApproveModal(false);
        setSelectedHelper(null);
        setDocsVerified(false);
        toast.success('Helper approved successfully! They can now receive tasks.', {
          duration: 4000,
          icon: '✅',
        });
      }
    } catch (error) {
      console.error('Error approving helper:', error);
      toast.error('Failed to approve helper. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setActionLoading(selectedHelper.id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/helpers/${selectedHelper.id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      const data = await response.json();
      
      if (data.success) {
        setHelpers(helpers.filter(helper => helper.id !== selectedHelper.id));
        setShowRejectModal(false);
        setSelectedHelper(null);
        setRejectionReason('');
        toast.success('Helper rejected successfully', {
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error rejecting helper:', error);
      toast.error('Failed to reject helper. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const openApproveModal = (helper) => {
    setSelectedHelper(helper);
    setShowApproveModal(true);
  };

  const openRejectModal = (helper) => {
    setSelectedHelper(helper);
    setShowRejectModal(true);
  };

  const closeModals = () => {
    setShowApproveModal(false);
    setShowRejectModal(false);
    setSelectedHelper(null);
    setRejectionReason('');
    setDocsVerified(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="pending-approvals">
        <h2>Pending Helper Approvals</h2>
        <div className="helpers-grid">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (helpers.length === 0) {
    return (
      <div className="pending-approvals">
        <h2>Pending Helper Approvals</h2>
        <div className="empty-state">
          <Check size={64} />
          <h3>All Caught Up!</h3>
          <p>No pending approvals at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pending-approvals">
      <div className="section-header">
        <h2>Pending Helper Approvals</h2>
        <span className="badge">{helpers.length} Pending</span>
      </div>

      <div className="helpers-grid">
        {helpers.map((helper) => (
          <div key={helper.id} className="helper-card">
            <div className="helper-avatar">
              {helper.fullName ? helper.fullName.split(' ').map(n => n[0]).join('') : helper.phone.slice(0, 2)}
            </div>
            
            <div className="helper-info">
              <h3>{helper.fullName || 'Helper'}</h3>
              
              <div className="info-item">
                <Phone size={16} />
                <span>{helper.phone}</span>
              </div>
              
              <div className="info-item">
                <Calendar size={16} />
                <span>Applied: {formatDate(helper.createdAt)}</span>
              </div>

              <div className="info-item">
                <FileText size={16} />
                <span>Status: {helper.verificationStatus}</span>
              </div>

              <div className="helper-details">
                <div className="detail-row">
                  <strong>Account Holder:</strong>
                  <span>{helper.accountHolderName}</span>
                </div>
                <div className="detail-row">
                  <strong>Account Number:</strong>
                  <span>{helper.accountNumber}</span>
                </div>
                <div className="detail-row">
                  <strong>IFSC Code:</strong>
                  <span>{helper.ifscCode}</span>
                </div>
              </div>

              <div className="documents-section">
                <h4>Documents</h4>
                <div className="documents-grid">
                  {helper.aadharCardDocument && (
                    <button
                      className="doc-button"
                      onClick={() => window.open(helper.aadharCardDocument, '_blank')}
                    >
                      <FileText size={16} />
                      Aadhar Card
                    </button>
                  )}
                  {helper.addressProofDocument && (
                    <button
                      className="doc-button"
                      onClick={() => window.open(helper.addressProofDocument, '_blank')}
                    >
                      <FileText size={16} />
                      Address Proof
                    </button>
                  )}
                  {helper.drivingLicenseDocument && (
                    <button
                      className="doc-button"
                      onClick={() => window.open(helper.drivingLicenseDocument, '_blank')}
                    >
                      <FileText size={16} />
                      Driving License
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="helper-actions">
              <button
                className="approve-btn"
                onClick={() => openApproveModal(helper)}
                disabled={actionLoading === helper.id}
              >
                {actionLoading === helper.id ? (
                  <div className="button-loader"></div>
                ) : (
                  <>
                    <Check size={18} />
                    Approve
                  </>
                )}
              </button>
              <button
                className="reject-btn"
                onClick={() => openRejectModal(helper)}
                disabled={actionLoading === helper.id}
              >
                {actionLoading === helper.id ? (
                  <div className="button-loader"></div>
                ) : (
                  <>
                    <X size={18} />
                    Reject
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedHelper && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <Check size={48} className="modal-icon success" />
              <h2>Approve Helper</h2>
            </div>
            <div className="modal-body">
              <p className="modal-text">
                You are about to approve <strong>{selectedHelper.fullName || 'this helper'}</strong>.
              </p>
              <div className="warning-box">
                <AlertTriangle size={20} />
                <p>After approval, this helper will be able to receive and complete tasks.</p>
              </div>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="docsVerified"
                  checked={docsVerified}
                  onChange={(e) => setDocsVerified(e.target.checked)}
                />
                <label htmlFor="docsVerified">
                  I have verified all documents (Aadhar, Address Proof, Driving License)
                </label>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModals}>
                Cancel
              </button>
              <button
                className="btn-confirm-approve"
                onClick={() => handleApprove(selectedHelper.id)}
                disabled={!docsVerified || actionLoading}
              >
                {actionLoading ? <div className="button-loader"></div> : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedHelper && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <X size={48} className="modal-icon danger" />
              <h2>Reject Helper</h2>
            </div>
            <div className="modal-body">
              <p className="modal-text">
                You are about to reject <strong>{selectedHelper.fullName || 'this helper'}</strong>.
              </p>
              <div className="warning-box danger">
                <AlertTriangle size={20} />
                <p>This action will notify the helper about the rejection.</p>
              </div>
              <div className="input-group">
                <label htmlFor="rejectionReason">Reason for Rejection *</label>
                <textarea
                  id="rejectionReason"
                  rows="4"
                  placeholder="Please provide a detailed reason for rejection (e.g., Invalid documents, Incomplete information, etc.)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModals}>
                Cancel
              </button>
              <button
                className="btn-confirm-reject"
                onClick={handleReject}
                disabled={!rejectionReason.trim() || actionLoading}
              >
                {actionLoading ? <div className="button-loader"></div> : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            iconTheme: {
              primary: '#90ee90',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default PendingApprovals;
