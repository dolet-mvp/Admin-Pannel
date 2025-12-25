import { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  User,
  ClipboardList,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import '../styles/HelpseekerDetailsModal.css';

const HelpseekerDetailsModal = ({ helpseekerId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [helpseeker, setHelpseeker] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    fetchHelpseekerDetails();
  }, [helpseekerId]);

  useEffect(() => {
    if (activeTab === 'tasks') {
      fetchHelpseekerTasks();
    }
  }, [activeTab]);

  const fetchHelpseekerDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/helpseekers/${helpseekerId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setHelpseeker(data.helpseeker);
      }
    } catch (error) {
      console.error('Error fetching helpseeker details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHelpseekerTasks = async () => {
    setTasksLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/helpseekers/${helpseekerId}/tasks`,
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
      console.error('Error fetching helpseeker tasks:', error);
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
        <div className="modal-content helpseeker-details-modal" onClick={(e) => e.stopPropagation()}>
          <div className="loading-state">
            <p>Loading helpseeker details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!helpseeker) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content helpseeker-details-modal" onClick={(e) => e.stopPropagation()}>
          <div className="error-state">
            <p>Helpseeker not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content helpseeker-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><User size={24} /> Helpseeker Details</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="helpseeker-details-content">
          {/* Helpseeker Profile Section */}
          <div className="profile-section">
            <div className="profile-header">
              {helpseeker.profilePhoto ? (
                <img src={helpseeker.profilePhoto} alt={helpseeker.fullName} className="profile-photo" />
              ) : (
                <div className="profile-photo-placeholder">
                  {helpseeker.fullName?.charAt(0) || 'H'}
                </div>
              )}
              <div className="profile-info">
                <h3>{helpseeker.fullName || 'Helpseeker'}</h3>
                <div className="status-badges">
                  <span className="status-badge active">
                    Active User
                  </span>
                </div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <ClipboardList size={24} color="#3b82f6" />
                <div>
                  <span className="stat-value">{helpseeker.totalTasks || 0}</span>
                  <span className="stat-label">Tasks Posted</span>
                </div>
              </div>
              <div className="stat-card">
                <TrendingUp size={24} color="#10b981" />
                <div>
                  <span className="stat-value">{helpseeker.completedTasks || 0}</span>
                  <span className="stat-label">Completed</span>
                </div>
              </div>
              <div className="stat-card">
                <DollarSign size={24} color="#8b5cf6" />
                <div>
                  <span className="stat-value">{formatCurrency(helpseeker.totalSpent)}</span>
                  <span className="stat-label">Total Spent</span>
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
                        <span className="value">{helpseeker.phone}</span>
                      </div>
                    </div>
                    {helpseeker.email && (
                      <div className="info-item">
                        <Mail size={18} />
                        <div>
                          <span className="label">Email</span>
                          <span className="value">{helpseeker.email}</span>
                        </div>
                      </div>
                    )}
                    <div className="info-item">
                      <Calendar size={18} />
                      <div>
                        <span className="label">Joined Date</span>
                        <span className="value">{formatDate(helpseeker.createdAt)}</span>
                      </div>
                    </div>
                    {helpseeker.address && (
                      <div className="info-item">
                        <MapPin size={18} />
                        <div>
                          <span className="label">Address</span>
                          <span className="value">{helpseeker.address}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="info-section">
                  <h4>Account Details</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">User ID:</span>
                      <span className="value">{helpseeker.id}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Account Status:</span>
                      <span className="value success">Active</span>
                    </div>
                  </div>
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
                        </div>
                        {task.helperName && (
                          <div className="task-helper">
                            <span className="label">Helper:</span>
                            <span>{task.helperName}</span>
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

export default HelpseekerDetailsModal;
