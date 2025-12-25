import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  Filter,
  FileText,
  User,
  Shield,
  TrendingUp
} from 'lucide-react';
import SkeletonCard from '../components/SkeletonCard';
import ReportDetailsModal from '../components/ReportDetailsModal';
import '../styles/Reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [reportedUserTypeFilter, setReportedUserTypeFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, [statusFilter, categoryFilter, reportedUserTypeFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (reportedUserTypeFilter !== 'all') params.append('reportedUserType', reportedUserTypeFilter);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/report/admin/all?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setReports(data.data.reports || []);
        setFilteredReports(data.data.reports || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/report/admin/stats`,
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
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredReports(reports);
    } else {
      const filtered = reports.filter(report =>
        (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (report.category && report.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (report.id && report.id.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredReports(filtered);
    }
  }, [searchTerm, reports]);

  const handleViewDetails = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/report/admin/${reportId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setSelectedReport(data.data);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error('Error fetching report details:', error);
      alert('Failed to fetch report details');
    }
  };

  const handleUpdateReport = async (reportId, updateData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/report/admin/${reportId}`,
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
        alert('Report updated successfully');
        fetchReports();
        fetchStats();
        setShowDetailsModal(false);
      } else {
        alert(data.message || 'Failed to update report');
      }
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Failed to update report');
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
      pending: { icon: Clock, color: 'warning', label: 'Pending' },
      under_review: { icon: Eye, color: 'info', label: 'Under Review' },
      resolved: { icon: CheckCircle, color: 'success', label: 'Resolved' },
      dismissed: { icon: XCircle, color: 'error', label: 'Dismissed' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`status-badge status-${config.color}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
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

  if (loading) {
    return (
      <div className="reports-page">
        <h2>Reports Management</h2>
        <div className="reports-grid">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="section-header">
        <div>
          <h2><AlertTriangle size={28} /> Reports Management</h2>
          <p className="report-count">{filteredReports.length} Total Reports</p>
        </div>
        
        <button className="refresh-btn" onClick={fetchReports}>
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon warning">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.statusBreakdown.pending}</h3>
              <p>Pending</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon info">
              <Eye size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.statusBreakdown.underReview}</h3>
              <p>Under Review</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon success">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.statusBreakdown.resolved}</h3>
              <p>Resolved</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon error">
              <XCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.statusBreakdown.dismissed}</h3>
              <p>Dismissed</p>
            </div>
          </div>
        </div>
      )}

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by description, category, or report ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>

          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="inappropriate_behavior">Inappropriate Behavior</option>
            <option value="fraud">Fraud</option>
            <option value="harassment">Harassment</option>
            <option value="violence_threat">Violence/Threat</option>
            <option value="spam">Spam</option>
            <option value="fake_profile">Fake Profile</option>
            <option value="payment_issue">Payment Issue</option>
            <option value="poor_service">Poor Service</option>
            <option value="other">Other</option>
          </select>

          <select 
            value={reportedUserTypeFilter} 
            onChange={(e) => setReportedUserTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All User Types</option>
            <option value="helper">Helpers</option>
            <option value="helpseeker">Helpseekers</option>
          </select>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="empty-state">
          <FileText size={64} />
          <h3>No Reports Found</h3>
          <p>There are no reports matching your criteria.</p>
        </div>
      ) : (
        <div className="reports-grid">
          {filteredReports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                {getStatusBadge(report.status)}
                <span className="report-category">{getCategoryLabel(report.category)}</span>
              </div>

              <div className="report-body">
                <div className="report-info">
                  <div className="info-row">
                    <User size={16} />
                    <span className="label">Reported User:</span>
                    <span className="value">
                      {report.reportedUserType.charAt(0).toUpperCase() + report.reportedUserType.slice(1)}
                    </span>
                  </div>
                  
                  <div className="info-row">
                    <Shield size={16} />
                    <span className="label">Reporter:</span>
                    <span className="value">
                      {report.reporterType.charAt(0).toUpperCase() + report.reporterType.slice(1)}
                    </span>
                  </div>

                  <div className="info-row">
                    <Clock size={16} />
                    <span className="label">Submitted:</span>
                    <span className="value">{formatDate(report.createdAt)}</span>
                  </div>
                </div>

                <div className="report-description">
                  <p>{report.description.substring(0, 150)}{report.description.length > 150 ? '...' : ''}</p>
                </div>

                {report.adminNotes && (
                  <div className="admin-notes">
                    <strong>Admin Notes:</strong> {report.adminNotes.substring(0, 100)}...
                  </div>
                )}
              </div>

              <div className="report-footer">
                <button 
                  className="view-details-btn"
                  onClick={() => handleViewDetails(report.id)}
                >
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDetailsModal && selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => setShowDetailsModal(false)}
          onUpdate={handleUpdateReport}
        />
      )}
    </div>
  );
};

export default Reports;
