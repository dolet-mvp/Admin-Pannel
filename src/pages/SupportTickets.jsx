import { useState, useEffect } from 'react';
import { 
  Headphones, 
  Search, 
  Eye, 
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Filter,
  MessageSquare,
  TrendingUp,
  User,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import SkeletonCard from '../components/SkeletonCard';
import TicketDetailsModal from '../components/TicketDetailsModal';
import '../styles/SupportTickets.css';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1 });

  useEffect(() => {
    fetchTickets();
    fetchStatistics();
  }, [statusFilter, priorityFilter, subjectFilter, pagination.page]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });
      
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (subjectFilter !== 'all') params.append('subject', subjectFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/support/admin/tickets?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setTickets(data.data.tickets || []);
        setFilteredTickets(data.data.tickets || []);
        setPagination(prev => ({
          ...prev,
          totalPages: data.data.pagination.totalPages,
        }));
        if (data.data.stats) {
          setStats(data.data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/support/admin/statistics`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleViewDetails = async (ticketId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/support/ticket/${ticketId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setSelectedTicket(data.data);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      alert('Failed to fetch ticket details');
    }
  };

  const handleUpdateTicket = async (ticketId, updateData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/support/admin/ticket/${ticketId}/update`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      );
      const data = await response.json();
      
      if (data.success) {
        alert('Ticket updated successfully');
        fetchTickets();
        fetchStatistics();
        setShowDetailsModal(false);
      } else {
        alert(data.message || 'Failed to update ticket');
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Failed to update ticket');
    }
  };

  const handleReplyToTicket = async (ticketId, message, isInternal) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/support/ticket/${ticketId}/reply`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message, isInternal }),
        }
      );
      const data = await response.json();
      
      if (data.success) {
        alert('Reply sent successfully');
        // Refresh ticket details
        handleViewDetails(ticketId);
      } else {
        alert(data.message || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { icon: AlertCircle, color: 'warning', label: 'Open' },
      in_progress: { icon: Clock, color: 'info', label: 'In Progress' },
      waiting_for_response: { icon: MessageSquare, color: 'purple', label: 'Waiting' },
      resolved: { icon: CheckCircle, color: 'success', label: 'Resolved' },
      closed: { icon: XCircle, color: 'secondary', label: 'Closed' },
      reopened: { icon: AlertTriangle, color: 'danger', label: 'Reopened' },
    };

    const config = statusConfig[status] || statusConfig.open;
    const Icon = config.icon;

    return (
      <span className={`status-badge status-${config.color}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { color: 'low', label: 'Low' },
      medium: { color: 'medium', label: 'Medium' },
      high: { color: 'high', label: 'High' },
      urgent: { color: 'urgent', label: 'Urgent' },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;

    return (
      <span className={`priority-badge priority-${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getSubjectLabel = (subject) => {
    const labels = {
      technical_issue: 'Technical Issue',
      payment_issue: 'Payment Issue',
      account_issue: 'Account Issue',
      task_issue: 'Task Issue',
      feature_request: 'Feature Request',
      bug_report: 'Bug Report',
      general_inquiry: 'General Inquiry',
      other: 'Other',
    };
    return labels[subject] || subject;
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="support-tickets-page">
        <h2>Support Tickets</h2>
        <div className="tickets-grid">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="support-tickets-page">
      <div className="section-header">
        <div>
          <h2><Headphones size={28} /> Support Tickets</h2>
          <p className="ticket-count">{stats?.total || 0} Total Tickets</p>
        </div>
        
        <button className="refresh-btn" onClick={fetchTickets}>
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon warning">
              <AlertCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.open || 0}</h3>
              <p>Open</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon info">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.inProgress || 0}</h3>
              <p>In Progress</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon purple">
              <MessageSquare size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.waitingForResponse || 0}</h3>
              <p>Waiting</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon success">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.resolved || 0}</h3>
              <p>Resolved</p>
            </div>
          </div>
        </div>
      )}

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by ticket ID, title, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchTickets()}
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="waiting_for_response">Waiting for Response</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="reopened">Reopened</option>
          </select>

          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select 
            value={subjectFilter} 
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Subjects</option>
            <option value="technical_issue">Technical Issue</option>
            <option value="payment_issue">Payment Issue</option>
            <option value="account_issue">Account Issue</option>
            <option value="task_issue">Task Issue</option>
            <option value="feature_request">Feature Request</option>
            <option value="bug_report">Bug Report</option>
            <option value="general_inquiry">General Inquiry</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="empty-state">
          <Headphones size={64} />
          <h3>No Tickets Found</h3>
          <p>There are no support tickets matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="tickets-grid">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-header">
                  <div className="ticket-id-section">
                    <span className="ticket-id">{ticket.ticketId}</span>
                    {getPriorityBadge(ticket.priority)}
                  </div>
                  {getStatusBadge(ticket.status)}
                </div>

                <div className="ticket-body">
                  <h3 className="ticket-title">{ticket.title}</h3>
                  
                  <div className="ticket-meta">
                    <span className="subject-tag">{getSubjectLabel(ticket.subject)}</span>
                  </div>

                  <div className="ticket-description">
                    <p>{ticket.description.substring(0, 120)}{ticket.description.length > 120 ? '...' : ''}</p>
                  </div>

                  <div className="ticket-info">
                    <div className="info-row">
                      <User size={16} />
                      <span>Created by: {ticket.userType?.charAt(0).toUpperCase() + ticket.userType?.slice(1) || 'User'}</span>
                    </div>
                    
                    <div className="info-row">
                      <Clock size={16} />
                      <span>{formatDate(ticket.createdAt)}</span>
                    </div>

                    {ticket.replies && ticket.replies.length > 0 && (
                      <div className="info-row">
                        <MessageSquare size={16} />
                        <span>{ticket.replies.length} {ticket.replies.length === 1 ? 'Reply' : 'Replies'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ticket-footer">
                  <button 
                    className="view-details-btn"
                    onClick={() => handleViewDetails(ticket.ticketId)}
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showDetailsModal && selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={() => setShowDetailsModal(false)}
          onUpdate={handleUpdateTicket}
          onReply={handleReplyToTicket}
        />
      )}
    </div>
  );
};

export default SupportTickets;
