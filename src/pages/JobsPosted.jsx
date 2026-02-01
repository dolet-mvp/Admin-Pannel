import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  RefreshCw,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  X,
  ListChecks,
  Trash2
} from 'lucide-react';
import '../styles/JobsPosted.css';

const JobsPosted = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [expandedSteps, setExpandedSteps] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, priorityFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/tasks?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        const jobsList = data.tasks || [];
        setJobs(jobsList);
        setFilteredJobs(jobsList);
        // Use stats from API if available
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job =>
        (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.category && job.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.id && job.id.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm, jobs]);

  const getStatusColor = (status) => {
    const colors = {
      draft: 'status-draft',
      published: 'status-published',
      in_queue: 'status-queue',
      assigned: 'status-assigned',
      on_the_way: 'status-on-way',
      arrived: 'status-arrived',
      in_progress: 'status-in-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
      disputed: 'status-disputed'
    };
    return colors[status] || 'status-default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high',
      urgent: 'priority-urgent'
    };
    return colors[priority] || 'priority-medium';
  };

  const formatStatus = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
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

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/tasks/${jobId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        // Remove the job from state
        setJobs(prev => prev.filter(job => job.id !== jobId));
        setFilteredJobs(prev => prev.filter(job => job.id !== jobId));
        // Update stats
        setStats(prev => ({ ...prev, total: prev.total - 1 }));
      } else {
        alert(data.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('An error occurred while deleting the job');
    }
  };

  return (
    <div className="jobs-posted-container">
      <div className="jobs-header">
        <div className="header-title">
          <Briefcase size={28} />
          <div>
            <h2>Jobs Posted</h2>
            <p>View and manage all jobs posted on the platform</p>
          </div>
        </div>
        <button className="refresh-btn" onClick={fetchJobs} disabled={loading}>
          <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <Briefcase size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Jobs</span>
          </div>
        </div>
        <div className="stat-card published">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.published}</span>
            <span className="stat-label">Published</span>
          </div>
        </div>
        <div className="stat-card in-progress">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
        <div className="stat-card completed">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="stat-card cancelled">
          <div className="stat-icon">
            <XCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.cancelled}</span>
            <span className="stat-label">Cancelled</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by title, description, category, or ID..."
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
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="in_queue">In Queue</option>
            <option value="assigned">Assigned</option>
            <option value="on_the_way">On The Way</option>
            <option value="arrived">Arrived</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="disputed">Disputed</option>
          </select>

          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="jobs-content">
        <div className="jobs-table-container">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Steps</th>
                <th>Budget</th>
                <th>Est. Duration</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Assigned Helper</th>
                <th>Location</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="table-loading">
                    <RefreshCw size={24} className="spinning" />
                    <span>Loading jobs...</span>
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="10" className="table-empty">
                    <Briefcase size={48} />
                    <h3>No jobs found</h3>
                    <p>There are no jobs matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td className="cell-title">{job.title || 'Untitled'}</td>
                    <td className="cell-steps">
                      {job.steps && job.steps.length > 0 ? (
                        <div className="steps-preview">
                          <span className="steps-count">
                            <ListChecks size={14} />
                            {job.steps.length} step{job.steps.length > 1 ? 's' : ''}
                          </span>
                          <button 
                            className="expand-steps-btn"
                            onClick={() => setExpandedSteps(expandedSteps === job.id ? null : job.id)}
                          >
                            {expandedSteps === job.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      ) : (
                        <span className="no-steps">No steps</span>
                      )}
                    </td>
                    <td className="cell-budget">{formatCurrency(job.budget)}</td>
                    <td className="cell-duration">
                      {job.estimatedDuration ? `${job.estimatedDuration} mins` : 'N/A'}
                    </td>
                    <td className="cell-date">{formatDate(job.dueDate)}</td>
                    <td className="cell-status">
                      <span className={`status-badge ${getStatusColor(job.status)}`}>
                        {formatStatus(job.status)}
                      </span>
                    </td>
                    <td className="cell-helper">
                      {job.assignedHelper?.fullName || job.assignedHelperId?.slice(-8) || 'Unassigned'}
                    </td>
                    <td className="cell-location">
                      {job.location?.city || job.location?.address?.substring(0, 20) || 'N/A'}
                    </td>
                    <td className="cell-created">{formatDate(job.createdAt)}</td>
                    <td className="cell-action">
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteJob(job.id)}
                        title="Delete job"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Steps Modal */}
      {expandedSteps && (
        <div className="steps-modal-overlay" onClick={() => setExpandedSteps(null)}>
          <div className="steps-modal" onClick={(e) => e.stopPropagation()}>
            <div className="steps-modal-header">
              <h3>
                <ListChecks size={20} />
                Task Steps
              </h3>
              <button className="close-modal-btn" onClick={() => setExpandedSteps(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="steps-modal-content">
              {(() => {
                const job = filteredJobs.find(j => j.id === expandedSteps);
                if (!job || !job.steps || job.steps.length === 0) {
                  return <p className="no-steps-message">No steps available for this task.</p>;
                }
                return (
                  <ul className="steps-list">
                    {job.steps.map((step, index) => (
                      <li key={index} className="step-item">
                        <span className="step-number">{index + 1}</span>
                        <span className="step-text">{typeof step === 'string' ? step : step.title || step.description || JSON.stringify(step)}</span>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPosted;
