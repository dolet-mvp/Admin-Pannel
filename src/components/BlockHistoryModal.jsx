import { useState, useEffect } from 'react';
import { X, History, Clock, Ban, Shield, Calendar } from 'lucide-react';
import '../styles/BlockHistoryModal.css';

const BlockHistoryModal = ({ userId, userType, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    fetchBlockHistory();
  }, [userId, userType]);

  const fetchBlockHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/blocks/users/${userId}/history?userType=${userType}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setHistoryData(data);
      }
    } catch (error) {
      console.error('Error fetching block history:', error);
    } finally {
      setLoading(false);
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

  const getDuration = (blockedAt, unblockedAt) => {
    if (!unblockedAt) return 'Ongoing';
    
    const start = new Date(blockedAt);
    const end = new Date(unblockedAt);
    const diff = end - start;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${hours % 24} hour${(hours % 24) !== 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><History size={24} /> Block History</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading history...</p>
          </div>
        ) : historyData ? (
          <div className="history-content">
            <div className="user-summary">
              <div className="user-details">
                {historyData.user?.profilePhoto ? (
                  <img 
                    src={historyData.user.profilePhoto} 
                    alt={historyData.user.fullName}
                    className="user-avatar-large"
                  />
                ) : (
                  <div className="user-avatar-placeholder-large">
                    {historyData.user?.fullName?.charAt(0) || '?'}
                  </div>
                )}
                <div className="user-info">
                  <h3>{historyData.user?.fullName || 'Unknown User'}</h3>
                  <p className="user-email">{historyData.user?.email}</p>
                  <p className="user-phone">{historyData.user?.phone}</p>
                  <span className={`user-type-badge ${userType}`}>
                    {userType}
                  </span>
                </div>
              </div>

              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-value">{historyData.totalBlocks || 0}</span>
                  <span className="stat-label">Total Blocks</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{historyData.activeBlocks || 0}</span>
                  <span className="stat-label">Active Blocks</span>
                </div>
              </div>
            </div>

            <div className="history-timeline">
              <h3>Block History Timeline</h3>
              
              {historyData.blockHistory && historyData.blockHistory.length > 0 ? (
                <div className="timeline">
                  {historyData.blockHistory.map((block, index) => (
                    <div key={block.id} className={`timeline-item ${block.isActive ? 'active' : 'inactive'}`}>
                      <div className="timeline-marker">
                        {block.isActive ? <Ban size={20} /> : <Shield size={20} />}
                      </div>
                      
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h4>
                            {block.isActive ? 'Active Block' : 'Block Ended'}
                          </h4>
                          <span className={`block-type-badge ${block.blockType}`}>
                            {block.blockType === 'temporary' ? <Clock size={14} /> : <Ban size={14} />}
                            {block.blockType}
                          </span>
                        </div>

                        <div className="timeline-details">
                          <div className="detail-row">
                            <Calendar size={16} />
                            <span>Blocked: {formatDate(block.blockedAt)}</span>
                          </div>

                          {block.expiresAt && (
                            <div className="detail-row">
                              <Clock size={16} />
                              <span>Expires: {formatDate(block.expiresAt)}</span>
                            </div>
                          )}

                          {block.unblockedAt && (
                            <div className="detail-row">
                              <Shield size={16} />
                              <span>Unblocked: {formatDate(block.unblockedAt)}</span>
                            </div>
                          )}

                          <div className="detail-row">
                            <Clock size={16} />
                            <span>Duration: {getDuration(block.blockedAt, block.unblockedAt)}</span>
                          </div>

                          <div className="reason-box">
                            <strong>Reason:</strong>
                            <p>{block.reason}</p>
                          </div>

                          {block.unblockReason && (
                            <div className="reason-box unblock-reason">
                              <strong>Unblock Reason:</strong>
                              <p>{block.unblockReason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-history">
                  <History size={48} color="#ccc" />
                  <p>No block history found</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="error-state">
            <p>Failed to load block history</p>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockHistoryModal;
