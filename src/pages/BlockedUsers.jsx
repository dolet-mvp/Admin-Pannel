import { useState, useEffect } from 'react';
import { Shield, Search, Clock, Ban, Eye, History, UserX, RefreshCw } from 'lucide-react';
import SkeletonCard from '../components/SkeletonCard';
import BlockUserModal from '../components/BlockUserModal';
import BlockHistoryModal from '../components/BlockHistoryModal';
import '../styles/BlockedUsers.css';

const BlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [blockTypeFilter, setBlockTypeFilter] = useState('all');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1 });

  useEffect(() => {
    fetchBlockedUsers();
  }, [statusFilter, userTypeFilter, blockTypeFilter, pagination.page]);

  const fetchBlockedUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        status: statusFilter,
        page: pagination.page,
        limit: pagination.limit,
      });
      
      if (userTypeFilter !== 'all') params.append('userType', userTypeFilter);
      if (blockTypeFilter !== 'all') params.append('blockType', blockTypeFilter);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/blocks/users?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setBlockedUsers(data.blockedUsers || []);
        setFilteredUsers(data.blockedUsers || []);
        setPagination(prev => ({
          ...prev,
          totalPages: data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(blockedUsers);
    } else {
      const filtered = blockedUsers.filter(block =>
        (block.user?.fullName && block.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (block.user?.phone && block.user.phone.includes(searchTerm)) ||
        (block.user?.email && block.user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (block.reason && block.reason.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, blockedUsers]);

  const handleUnblock = async (userId, userType) => {
    if (!window.confirm('Are you sure you want to unblock this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/blocks/unblock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId, 
          userType,
          unblockReason: 'Unblocked by admin from panel'
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('User unblocked successfully');
        fetchBlockedUsers();
      } else {
        alert(data.message || 'Failed to unblock user');
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert('Failed to unblock user');
    }
  };

  const handleViewHistory = (userId, userType) => {
    setSelectedUser({ userId, userType });
    setShowHistoryModal(true);
  };

  const handleBlockUser = () => {
    setShowBlockModal(true);
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

  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return 'Permanent';
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h remaining`;
    return `${hours}h remaining`;
  };

  if (loading) {
    return (
      <div className="blocked-users">
        <h2>Blocked Users</h2>
        <div className="users-grid">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="blocked-users">
      <div className="section-header">
        <div>
          <h2><Shield size={28} /> Blocked Users Management</h2>
          <p className="user-count">{filteredUsers.length} Blocked Users</p>
        </div>
        
        <button className="block-user-btn" onClick={handleBlockUser}>
          <Ban size={20} />
          Block User
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, email, phone, or reason..."
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
            <option value="active">Active Blocks</option>
            <option value="inactive">Inactive Blocks</option>
            <option value="all">All Blocks</option>
          </select>

          <select 
            value={userTypeFilter} 
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All User Types</option>
            <option value="helper">Helpers</option>
            <option value="helpseeker">Helpseekers</option>
            <option value="admin">Admins</option>
          </select>

          <select 
            value={blockTypeFilter} 
            onChange={(e) => setBlockTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Block Types</option>
            <option value="temporary">Temporary</option>
            <option value="permanent">Permanent</option>
          </select>

          <button 
            className="refresh-btn"
            onClick={fetchBlockedUsers}
            title="Refresh"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <UserX size={64} color="#ccc" />
          <p>No blocked users found</p>
        </div>
      ) : (
        <>
          <div className="users-grid">
            {filteredUsers.map((block) => (
              <div key={block.id} className={`blocked-user-card ${block.isActive ? 'active-block' : 'inactive-block'}`}>
                <div className="card-header">
                  <div className="user-info">
                    {block.user?.profilePhoto ? (
                      <img 
                        src={block.user.profilePhoto} 
                        alt={block.user.fullName}
                        className="user-avatar"
                      />
                    ) : (
                      <div className="user-avatar-placeholder">
                        {block.user?.fullName?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <h3>{block.user?.fullName || 'Unknown User'}</h3>
                      <span className={`user-type-badge ${block.userType}`}>
                        {block.userType}
                      </span>
                    </div>
                  </div>
                  
                  <div className="block-status">
                    {block.isActive ? (
                      <span className="status-badge active">
                        <Ban size={14} /> Active
                      </span>
                    ) : (
                      <span className="status-badge inactive">
                        Unblocked
                      </span>
                    )}
                  </div>
                </div>

                <div className="card-content">
                  <div className="info-row">
                    <span className="label">Email:</span>
                    <span className="value">{block.user?.email || 'N/A'}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Phone:</span>
                    <span className="value">{block.user?.phone || 'N/A'}</span>
                  </div>

                  <div className="info-row">
                    <span className="label">Block Type:</span>
                    <span className={`block-type-badge ${block.blockType}`}>
                      {block.blockType === 'temporary' ? <Clock size={14} /> : <Ban size={14} />}
                      {block.blockType}
                    </span>
                  </div>

                  {block.blockType === 'temporary' && (
                    <div className="info-row">
                      <span className="label">Time Remaining:</span>
                      <span className="value expires-info">
                        {getTimeRemaining(block.expiresAt)}
                      </span>
                    </div>
                  )}

                  <div className="info-row">
                    <span className="label">Blocked At:</span>
                    <span className="value">{formatDate(block.blockedAt)}</span>
                  </div>

                  {!block.isActive && block.unblockedAt && (
                    <div className="info-row">
                      <span className="label">Unblocked At:</span>
                      <span className="value">{formatDate(block.unblockedAt)}</span>
                    </div>
                  )}

                  <div className="reason-section">
                    <span className="label">Reason:</span>
                    <p className="reason-text">{block.reason}</p>
                  </div>

                  {!block.isActive && block.unblockReason && (
                    <div className="reason-section">
                      <span className="label">Unblock Reason:</span>
                      <p className="reason-text">{block.unblockReason}</p>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button
                    className="action-btn view-history"
                    onClick={() => handleViewHistory(block.userId, block.userType)}
                    title="View History"
                  >
                    <History size={18} />
                    History
                  </button>
                  
                  {block.isActive && (
                    <button
                      className="action-btn unblock"
                      onClick={() => handleUnblock(block.userId, block.userType)}
                      title="Unblock User"
                    >
                      <Shield size={18} />
                      Unblock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="page-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showBlockModal && (
        <BlockUserModal 
          onClose={() => setShowBlockModal(false)}
          onSuccess={fetchBlockedUsers}
        />
      )}

      {showHistoryModal && selectedUser && (
        <BlockHistoryModal
          userId={selectedUser.userId}
          userType={selectedUser.userType}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default BlockedUsers;
