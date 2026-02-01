import { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  RefreshCw,
  Filter,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle,
  Navigation,
  Play,
  Eye,
  X,
  Calendar,
  ListOrdered
} from 'lucide-react';
import '../styles/ActiveTasks.css';

const ActiveTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    assigned: 0,
    onTheWay: 0,
    arrived: 0,
    inProgress: 0,
    published: 0,
    inQueue: 0
  });

  const activeStatuses = ['assigned', 'on_the_way', 'arrived', 'in_progress', 'published', 'in_queue'];

  useEffect(() => {
    fetchActiveTasks();
  }, [statusFilter]);

  const fetchActiveTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      // Only fetch active statuses
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/tasks/active?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        const tasksList = data.tasks || [];
        setTasks(tasksList);
        setFilteredTasks(tasksList);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching active tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter(task =>
        (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.assignedHelper?.fullName && task.assignedHelper.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.creator?.fullName && task.creator.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.id && task.id.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredTasks(filtered);
    }
  }, [searchTerm, tasks]);

  const getStatusColor = (status) => {
    const colors = {
      in_queue: 'status-in-queue',
      published: 'status-published',
      assigned: 'status-assigned',
      on_the_way: 'status-on-way',
      arrived: 'status-arrived',
      in_progress: 'status-in-progress'
    };
    return colors[status] || 'status-default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      in_queue: <Clock size={16} />,
      published: <Activity size={16} />,
      assigned: <CheckCircle size={16} />,
      on_the_way: <Navigation size={16} />,
      arrived: <MapPin size={16} />,
      in_progress: <Play size={16} />
    };
    return icons[status] || <Clock size={16} />;
  };

  const formatStatus = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Not set';
    return `₹${parseFloat(amount).toLocaleString()}`;
  };

  const getTimeSince = (date) => {
    if (!date) return '';
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  return (
    <div className="active-tasks-container">
      <div className="active-tasks-header">
        <div className="header-title">
          <Activity size={28} />
          <div>
            <h2>Active Tasks</h2>
            <p>Monitor ongoing tasks in real-time</p>
          </div>
        </div>
        <button className="refresh-btn" onClick={fetchActiveTasks} disabled={loading}>
          <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Active</span>
          </div>
        </div>
        <div className="stat-card in-queue">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.inQueue}</span>
            <span className="stat-label">In Queue</span>
          </div>
        </div>
        <div className="stat-card published">
          <div className="stat-icon">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.published}</span>
            <span className="stat-label">Published</span>
          </div>
        </div>
        <div className="stat-card assigned">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.assigned}</span>
            <span className="stat-label">Assigned</span>
          </div>
        </div>
        <div className="stat-card on-way">
          <div className="stat-icon">
            <Navigation size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.onTheWay}</span>
            <span className="stat-label">On The Way</span>
          </div>
        </div>
        <div className="stat-card arrived">
          <div className="stat-icon">
            <MapPin size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.arrived}</span>
            <span className="stat-label">Arrived</span>
          </div>
        </div>
        <div className="stat-card in-progress">
          <div className="stat-icon">
            <Play size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by task title, helper, or helpseeker..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <Filter size={18} />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Active</option>
            <option value="in_queue">In Queue</option>
            <option value="published">Published</option>
            <option value="assigned">Assigned</option>
            <option value="on_the_way">On The Way</option>
            <option value="arrived">Arrived</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="tasks-content">
        {loading ? (
          <div className="loading-state">
            <RefreshCw size={32} className="spinning" />
            <p>Loading active tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <Activity size={64} />
            <h3>No active tasks</h3>
            <p>There are no tasks currently in progress.</p>
          </div>
        ) : (
          <div className="tasks-grid-vertical">
            {[...filteredTasks]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((task) => {
                const firstStepLocation = task.steps?.[0]?.location || task.location;
                return (
                  <div 
                    key={task.id} 
                    className={`task-card-vertical ${getStatusColor(task.status)}`}
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="card-status-bar"></div>
                    
                    <h3 className="card-title">{task.title || 'Untitled Task'}</h3>
                    
                    <div className="card-info-row">
                      <span className="card-label">Budget</span>
                      <span className="card-value">{formatCurrency(task.budget)}</span>
                    </div>
                    
                    <div className="card-info-row">
                      <span className="card-label">Duration</span>
                      <span className="card-value">
                        {task.estimatedDuration ? `${task.estimatedDuration} mins` : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="card-info-row">
                      <span className="card-label">Status</span>
                      <span className={`card-status-badge ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        {formatStatus(task.status)}
                      </span>
                    </div>
                    
                    {task.steps && task.steps.length > 0 && (
                      <div className="card-steps-section">
                        <span className="card-label">Steps ({task.steps.length})</span>
                        <div className="card-steps-list">
                          {task.steps.slice(0, 3).map((step, index) => (
                            <div key={index} className="card-step-item">
                              <span className="step-number">{index + 1}</span>
                              <span className="step-title">{step.title || step.description?.substring(0, 20) || `Step ${index + 1}`}</span>
                            </div>
                          ))}
                          {task.steps.length > 3 && (
                            <span className="more-steps">+{task.steps.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="card-info-row location-row">
                      <span className="card-label">Location</span>
                      <span className="card-value location-value">
                        <MapPin size={12} />
                        {firstStepLocation?.city || 
                         firstStepLocation?.address?.substring(0, 25) || 
                         'Not specified'}
                      </span>
                    </div>
                    
                    <div className="card-info-row poster-row">
                      <span className="card-label">Posted by</span>
                      <span className="card-value poster-name">
                        <User size={12} />
                        {task.creator?.fullName || 'Unknown'}
                      </span>
                    </div>
                    
                    <div className="card-footer">
                      <span className="card-time">{getTimeSince(task.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="task-modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            <div className="task-modal-header">
              <div className="modal-status">
                {getStatusIcon(selectedTask.status)}
                <span className={`status-badge ${getStatusColor(selectedTask.status)}`}>
                  {formatStatus(selectedTask.status)}
                </span>
              </div>
              <button className="close-modal-btn" onClick={() => setSelectedTask(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="task-modal-content">
              <h2>{selectedTask.title || 'Untitled Task'}</h2>
              
              {selectedTask.description && (
                <p className="modal-description">{selectedTask.description}</p>
              )}

              <div className="modal-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Budget</span>
                  <span className="detail-value">{formatCurrency(selectedTask.budget)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">
                    {selectedTask.estimatedDuration ? `${selectedTask.estimatedDuration} mins` : 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{selectedTask.category || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Priority</span>
                  <span className="detail-value">{selectedTask.priority || 'Medium'}</span>
                </div>
              </div>

              <div className="modal-section">
                <h4>Helper</h4>
                <div className="person-card">
                  <User size={20} />
                  <div>
                    <span className="person-name">{selectedTask.assignedHelper?.fullName || 'Not assigned'}</span>
                    {selectedTask.assignedHelper?.phone && (
                      <span className="person-phone">
                        <Phone size={12} /> {selectedTask.assignedHelper.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h4>Helpseeker</h4>
                <div className="person-card">
                  <User size={20} />
                  <div>
                    <span className="person-name">{selectedTask.creator?.fullName || 'Unknown'}</span>
                    {selectedTask.creator?.phone && (
                      <span className="person-phone">
                        <Phone size={12} /> {selectedTask.creator.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {selectedTask.location && (
                <div className="modal-section">
                  <h4>Location</h4>
                  <div className="location-card">
                    <MapPin size={20} />
                    <span>{selectedTask.location.address || selectedTask.location.city || 'Location set'}</span>
                  </div>
                </div>
              )}

              {selectedTask.steps && selectedTask.steps.length > 0 && (
                <div className="modal-section">
                  <h4><ListOrdered size={18} /> Steps ({selectedTask.steps.length})</h4>
                  <div className="modal-steps-list">
                    {selectedTask.steps.map((step, index) => (
                      <div key={index} className="modal-step-item">
                        <div className="modal-step-number">{index + 1}</div>
                        <div className="modal-step-content">
                          <span className="modal-step-title">{step.title || `Step ${index + 1}`}</span>
                          {step.description && (
                            <p className="modal-step-description">{step.description}</p>
                          )}
                          {step.location && (
                            <div className="modal-step-location">
                              <MapPin size={12} />
                              <span>{step.location.address || step.location.city || 'Location set'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-timeline">
                <h4>Timeline</h4>
                <div className="timeline-items">
                  <div className="timeline-item">
                    <Calendar size={14} />
                    <span>Created: {formatDate(selectedTask.createdAt)}</span>
                  </div>
                  {selectedTask.acceptedAt && (
                    <div className="timeline-item">
                      <CheckCircle size={14} />
                      <span>Accepted: {formatDate(selectedTask.acceptedAt)}</span>
                    </div>
                  )}
                  {selectedTask.startedAt && (
                    <div className="timeline-item">
                      <Play size={14} />
                      <span>Started: {formatDate(selectedTask.startedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveTasks;
