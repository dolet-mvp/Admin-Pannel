import { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  AlertTriangle, 
  Headphones,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import '../styles/AnalyticsDashboard.css';

// Skeleton Loader Components
const MetricCardSkeleton = () => (
  <div className="metric-card skeleton">
    <div className="metric-header">
      <div className="skeleton-icon"></div>
      <div className="skeleton-trend"></div>
    </div>
    <div className="skeleton-title"></div>
    <div className="skeleton-value"></div>
    <div className="skeleton-subtitle"></div>
  </div>
);

const ChartSkeleton = () => (
  <div className="chart-card skeleton">
    <div className="skeleton-chart-header"></div>
    <div className="skeleton-chart-body">
      <div className="skeleton-bar"></div>
      <div className="skeleton-bar"></div>
      <div className="skeleton-bar"></div>
      <div className="skeleton-bar"></div>
    </div>
  </div>
);

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState({
    helpers: null,
    helpseekers: null,
    blocks: null,
    reports: null,
    support: null,
  });

  useEffect(() => {
    fetchAllAnalytics();

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchAllAnalytics(true);
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchAllAnalytics = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

      const [helpersRes, helpseekersRes, blocksRes, reportsRes, supportRes] = await Promise.all([
        fetch(`${baseUrl}/api/admin/helpers/analytics`, { headers }),
        fetch(`${baseUrl}/api/admin/helpseekers/analytics`, { headers }),
        fetch(`${baseUrl}/api/admin/blocks/analytics`, { headers }),
        fetch(`${baseUrl}/api/report/admin/analytics`, { headers }),
        fetch(`${baseUrl}/api/support/admin/analytics`, { headers }),
      ]);

      const helpersData = await helpersRes.json();
      const helpseekersData = await helpseekersRes.json();
      const blocksData = await blocksRes.json();
      const reportsData = await reportsRes.json();
      const supportData = await supportRes.json();

      setAnalytics({
        helpers: helpersData.analytics || null,
        helpseekers: helpseekersData.analytics || null,
        blocks: blocksData.analytics || null,
        reports: reportsData.analytics || null,
        support: supportData.analytics || null,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const { helpers, helpseekers, blocks, reports, support } = analytics;

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Analytics Overview</h1>
          <p className="dashboard-subtitle">Real-time insights and system metrics</p>
        </div>
        <button 
          className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
          onClick={() => fetchAllAnalytics(true)}
          disabled={refreshing}
        >
          <RefreshCw size={18} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-section">
        {loading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon helpers-icon">
                  <Users size={24} />
                </div>
              </div>
              <h3 className="metric-title">Total Helpers</h3>
              <p className="metric-value">{helpers?.total?.toLocaleString() || 0}</p>
              <p className="metric-subtitle">
                <span className="metric-highlight approved">{helpers?.approved || 0} Active</span>
                <span className="metric-dot">•</span>
                <span className="metric-highlight pending">{helpers?.pending || 0} Pending</span>
              </p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon helpseekers-icon">
                  <UserCheck size={24} />
                </div>
              </div>
              <h3 className="metric-title">Total Helpseekers</h3>
              <p className="metric-value">{helpseekers?.total?.toLocaleString() || 0}</p>
              <p className="metric-subtitle">
                <span className="metric-highlight approved">{helpseekers?.active || 0} Active</span>
                <span className="metric-dot">•</span>
                <span className="metric-highlight inactive">{helpseekers?.inactive || 0} Inactive</span>
              </p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon blocked-icon">
                  <Shield size={24} />
                </div>
              </div>
              <h3 className="metric-title">Blocked Users</h3>
              <p className="metric-value">{blocks?.total?.toLocaleString() || 0}</p>
              <p className="metric-subtitle">
                <span className="metric-highlight">Active security blocks</span>
              </p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon reports-icon">
                  <AlertTriangle size={24} />
                </div>
              </div>
              <h3 className="metric-title">Reports</h3>
              <p className="metric-value">{reports?.total?.toLocaleString() || 0}</p>
              <p className="metric-subtitle">
                <span className="metric-highlight pending">{reports?.pending || 0} Pending</span>
                <span className="metric-dot">•</span>
                <span className="metric-highlight approved">{reports?.resolved || 0} Resolved</span>
              </p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon support-icon">
                  <Headphones size={24} />
                </div>
              </div>
              <h3 className="metric-title">Support Tickets</h3>
              <p className="metric-value">{support?.total?.toLocaleString() || 0}</p>
              <p className="metric-subtitle">
                <span className="metric-highlight pending">{support?.open || 0} Open</span>
                <span className="metric-dot">•</span>
                <span className="metric-highlight approved">{support?.resolved || 0} Resolved</span>
              </p>
            </div>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {loading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            {/* Helpers Chart */}
            {helpers && (
              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <h3 className="chart-title">Helpers Distribution</h3>
                    <p className="chart-subtitle">Status breakdown by category</p>
                  </div>
                  <div className="chart-legend">
                    <span className="legend-item"><span className="legend-dot pending"></span> Pending</span>
                    <span className="legend-item"><span className="legend-dot approved"></span> Approved</span>
                    <span className="legend-item"><span className="legend-dot rejected"></span> Rejected</span>
                    <span className="legend-item"><span className="legend-dot suspended"></span> Suspended</span>
                  </div>
                </div>
                <div className="chart-body">
                  <div className="chart-bars">
                    <div className="bar-group">
                      <div className="bar-container">
                        <div className="bar-bg">
                          <div 
                            className="bar-fill bar-pending" 
                            style={{ width: `${(helpers.pending / helpers.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bar-info">
                          <span className="bar-label">Pending</span>
                          <span className="bar-value">{helpers.pending}</span>
                        </div>
                      </div>
                      <div className="bar-container">
                        <div className="bar-bg">
                          <div 
                            className="bar-fill bar-approved" 
                            style={{ width: `${(helpers.approved / helpers.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bar-info">
                          <span className="bar-label">Approved</span>
                          <span className="bar-value">{helpers.approved}</span>
                        </div>
                      </div>
                      <div className="bar-container">
                        <div className="bar-bg">
                          <div 
                            className="bar-fill bar-rejected" 
                            style={{ width: `${(helpers.rejected / helpers.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bar-info">
                          <span className="bar-label">Rejected</span>
                          <span className="bar-value">{helpers.rejected}</span>
                        </div>
                      </div>
                      <div className="bar-container">
                        <div className="bar-bg">
                          <div 
                            className="bar-fill bar-suspended" 
                            style={{ width: `${(helpers.suspended / helpers.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bar-info">
                          <span className="bar-label">Suspended</span>
                          <span className="bar-value">{helpers.suspended}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Chart */}
            {reports && (
              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <h3 className="chart-title">Reports Overview</h3>
                    <p className="chart-subtitle">Current status distribution</p>
                  </div>
                  <div className="chart-legend">
                    <span className="legend-item"><span className="legend-dot pending"></span> Pending</span>
                    <span className="legend-item"><span className="legend-dot info"></span> Under Review</span>
                    <span className="legend-item"><span className="legend-dot approved"></span> Resolved</span>
                    <span className="legend-item"><span className="legend-dot secondary"></span> Dismissed</span>
                  </div>
                </div>
                <div className="chart-body">
                  <div className="chart-bars">
                    <div className="bar-group">
                      <div className="bar-container">
                        <div className="bar-bg">
                          <div 
                            className="bar-fill bar-pending" 
                            style={{ width: `${(reports.pending / reports.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bar-info">
                          <span className="bar-label">Pending</span>
                          <span className="bar-value">{reports.pending}</span>
                        </div>
                      </div>
                      <div className="bar-container">
                        <div className="bar-bg">
                          <div 
                            className="bar-fill bar-info" 
                            style={{ width: `${(reports.underReview / reports.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bar-info">
                          <span className="bar-label">Under Review</span>
                          <span className="bar-value">{reports.underReview}</span>
                        </div>
                      </div>
                      <div className="bar-container">
                        <div className="bar-bg">
                          <div 
                            className="bar-fill bar-approved" 
                            style={{ width: `${(reports.resolved / reports.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bar-info">
                          <span className="bar-label">Resolved</span>
                          <span className="bar-value">{reports.resolved}</span>
                        </div>
                      </div>
                      <div className="bar-container">
                        <div className="bar-bg">
                          <div 
                            className="bar-fill bar-secondary" 
                            style={{ width: `${(reports.dismissed / reports.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bar-info">
                          <span className="bar-label">Dismissed</span>
                          <span className="bar-value">{reports.dismissed}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Support Tickets Chart */}
            {support && (
              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <h3 className="chart-title">Support Tickets</h3>
                    <p className="chart-subtitle">Ticket status breakdown</p>
                  </div>
                  <div className="chart-legend">
                    <span className="legend-item"><span className="legend-dot danger"></span> Open</span>
                    <span className="legend-item"><span className="legend-dot info"></span> In Progress</span>
                    <span className="legend-item"><span className="legend-dot purple"></span> Waiting</span>
                    <span className="legend-item"><span className="legend-dot approved"></span> Resolved</span>
                  </div>
                </div>
                <div className="chart-body">
                  <div className="chart-bars">
                    <div className="bar-group">
                      <div className="bar-container">
                        <div className="bar-bg">
                          <div 
                            className="bar-fill bar-danger" 
                            style={{ width: `${(support.open / support.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bar-info">
                          <span className="bar-label">Open</span>
                          <span className="bar-value">{support.open}</span>
                        </div>
                      </div>
                      <div className="bar-container">
                        <div className="bar-bg">
                          <div 
                            className="bar-fill bar-info" 
                            style={{ width: `${(support.inProgress / support.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bar-info">
                          <span className="bar-label">In Progress</span>
                          <span className="bar-value">{support.inProgress}</span>
                        </div>
                      </div>
                      <div className="bar-container">
                        <div className="bar-bg">
                          <div 
                            className="bar-fill bar-purple" 
                            style={{ width: `${(support.waitingForResponse / support.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bar-info">
                          <span className="bar-label">Waiting</span>
                          <span className="bar-value">{support.waitingForResponse}</span>
                        </div>
                      </div>
                      <div className="bar-container">
                        <div className="bar-bg">
                          <div 
                            className="bar-fill bar-approved" 
                            style={{ width: `${(support.resolved / support.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bar-info">
                          <span className="bar-label">Resolved</span>
                          <span className="bar-value">{support.resolved}</span>
                        </div>
                      </div>
                      <div className="bar-container">
                        <div className="bar-bg">
                          <div 
                            className="bar-fill bar-secondary" 
                            style={{ width: `${(support.closed / support.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bar-info">
                          <span className="bar-label">Closed</span>
                          <span className="bar-value">{support.closed}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
