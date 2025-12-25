import { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Star, 
  FileText, 
  CheckCircle, 
  XCircle,
  DollarSign,
  ClipboardList,
  Download,
  ExternalLink,
  User,
  Shield,
  TrendingUp
} from 'lucide-react';
import '../styles/HelperDetailsModal.css';

const HelperDetailsModal = ({ helperId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [helper, setHelper] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    fetchHelperDetails();
  }, [helperId]);

  useEffect(() => {
    if (activeTab === 'tasks') {
      fetchHelperTasks();
    }
  }, [activeTab]);

  const fetchHelperDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/helpers/${helperId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setHelper(data.helper);
      }
    } catch (error) {
      console.error('Error fetching helper details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHelperTasks = async () => {
    setTasksLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/helpers/${helperId}/tasks`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Error fetching helper tasks:', error);
    } finally {
      setTasksLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content helper-details-modal" onClick={(e) => e.stopPropagation()}>
          <div className="loading-state">
            <p>Loading helper details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!helper) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content helper-details-modal" onClick={(e) => e.stopPropagation()}>
          <div className="error-state">
            <p>Helper not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content helper-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><User size={24} /> Helper Details</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="helper-details-content">
          {/* Helper Profile Section */}
          <div className="profile-section">
            <div className="profile-header">
              {helper.profilePhoto ? (
                <img src={helper.profilePhoto} alt={helper.fullName} className="profile-photo" />
              ) : (
                <div className="profile-photo-placeholder">
                  {helper.fullName?.charAt(0) || 'H'}
                </div>
              )}
              <div className="profile-info">
                <h3>{helper.fullName || 'Helper'}</h3>
                <div className="status-badges">
                  <span className={`status-badge ${helper.isApproved ? 'approved' : 'pending'}`}>
                    {helper.isApproved ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {helper.isApproved ? 'Approved' : 'Pending'}
                  </span>
                  {helper.isVerified && (
                    <span className="status-badge verified">
                      <Shield size={14} />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <Star size={24} color="#FFD700" fill="#FFD700" />
                <div>
                  <span className="stat-value">{parseFloat(helper.averageRating || 0).toFixed(1)}</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>
              <div className="stat-card">
                <ClipboardList size={24} color="#3b82f6" />
                <div>
                  <span className="stat-value">{helper.completedTasks || 0}</span>
                  <span className="stat-label">Tasks Done</span>
                </div>
              </div>
              <div className="stat-card">
                <DollarSign size={24} color="#10b981" />
                <div>
                  <span className="stat-value">{formatCurrency(helper.totalEarnings)}</span>
                  <span className="stat-label">Earnings</span>
                </div>
              </div>
              <div className="stat-card">
                <TrendingUp size={24} color="#8b5cf6" />
                <div>
                  <span className="stat-value">{helper.totalTasks || 0}</span>
                  <span className="stat-label">Total Tasks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="tabs-navigation">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
            <button 
              className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks History
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="info-section">
                  <h4>Contact Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <Phone size={18} />
                      <div>
                        <span className="label">Phone</span>
                        <span className="value">{helper.phone}</span>
                      </div>
                    </div>
                    {helper.email && (
                      <div className="info-item">
                        <Mail size={18} />
                        <div>
                          <span className="label">Email</span>
                          <span className="value">{helper.email}</span>
                        </div>
                      </div>
                    )}
                    <div className="info-item">
                      <Calendar size={18} />
                      <div>
                        <span className="label">Joined Date</span>
                        <span className="value">{formatDate(helper.createdAt)}</span>
                      </div>
                    </div>
                    {helper.address && (
                      <div className="info-item">
                        <MapPin size={18} />
                        <div>
                          <span className="label">Address</span>
                          <span className="value">{helper.address}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="info-section">
                  <h4>Account Details</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Account Status:</span>
                      <span className={`value ${helper.isApproved ? 'success' : 'warning'}`}>
                        {helper.isApproved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">User ID:</span>
                      <span className="value">{helper.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="documents-tab">
                <div className="documents-grid">
                  {helper.aadharCardDocument && (
                    <div className="document-card">
                      <div className="document-header">
                        <FileText size={24} color="#3b82f6" />
                        <h4>Aadhar Card</h4>
                      </div>
                      <div className="document-actions">
                        <a 
                          href={helper.aadharCardDocument} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="doc-btn view"
                        >
                          <ExternalLink size={16} />
                          View
                        </a>
                        <a 
                          href={helper.aadharCardDocument} 
                          download
                          className="doc-btn download"
                        >
                          <Download size={16} />
                          Download
                        </a>
                      </div>
                    </div>
                  )}

                  {helper.addressProofDocument && (
                    <div className="document-card">
                      <div className="document-header">
                        <FileText size={24} color="#10b981" />
                        <h4>Address Proof</h4>
                      </div>
                      <div className="document-actions">
                        <a 
                          href={helper.addressProofDocument} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="doc-btn view"
                        >
                          <ExternalLink size={16} />
                          View
                        </a>
                        <a 
                          href={helper.addressProofDocument} 
                          download
                          className="doc-btn download"
                        >
                          <Download size={16} />
                          Download
                        </a>
                      </div>
                    </div>
                  )}

                  {helper.drivingLicenseDocument && (
                    <div className="document-card">
                      <div className="document-header">
                        <FileText size={24} color="#f59e0b" />
                        <h4>Driving License</h4>
                      </div>
                      <div className="document-actions">
                        <a 
                          href={helper.drivingLicenseDocument} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="doc-btn view"
                        >
                          <ExternalLink size={16} />
                          View
                        </a>
                        <a 
                          href={helper.drivingLicenseDocument} 
                          download
                          className="doc-btn download"
                        >
                          <Download size={16} />
                          Download
                        </a>
                      </div>
                    </div>
                  )}

                  {!helper.aadharCardDocument && !helper.addressProofDocument && !helper.drivingLicenseDocument && (
                    <div className="empty-documents">
                      <FileText size={48} color="#ccc" />
                      <p>No documents uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="tasks-tab">
                {tasksLoading ? (
                  <div className="loading-state">
                    <p>Loading tasks...</p>
                  </div>
                ) : tasks.length > 0 ? (
                  <div className="tasks-list">
                    {tasks.map((task) => (
                      <div key={task.id} className="task-card">
                        <div className="task-header">
                          <h4>{task.title}</h4>
                          <span className={`task-status ${task.status}`}>
                            {task.status}
                          </span>
                        </div>
                        <p className="task-description">{task.description}</p>
                        <div className="task-details">
                          <div className="task-detail-item">
                            <Calendar size={14} />
                            <span>{formatDate(task.createdAt)}</span>
                          </div>
                          <div className="task-detail-item">
                            <DollarSign size={14} />
                            <span>{formatCurrency(task.price)}</span>
                          </div>
                          {task.rating && (
                            <div className="task-detail-item">
                              <Star size={14} fill="#FFD700" color="#FFD700" />
                              <span>{task.rating}</span>
                            </div>
                          )}
                        </div>
                        {task.helpseekerName && (
                          <div className="task-client">
                            <span className="label">Client:</span>
                            <span>{task.helpseekerName}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-tasks">
                    <ClipboardList size={48} color="#ccc" />
                    <p>No tasks found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelperDetailsModal;
