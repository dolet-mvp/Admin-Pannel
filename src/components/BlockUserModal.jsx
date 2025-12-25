import { useState, useEffect } from 'react';
import { X, Ban, Clock, AlertTriangle } from 'lucide-react';
import '../styles/BlockUserModal.css';

const BlockUserModal = ({ onClose, onSuccess, preSelectedUser = null }) => {
  const [formData, setFormData] = useState({
    userId: preSelectedUser?.userId || '',
    userType: preSelectedUser?.userType || 'helper',
    blockType: 'temporary',
    reason: '',
    durationHours: '24',
  });
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;
    
    setSearchLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = formData.userType === 'helper' 
        ? '/api/auth/admin/helpers'
        : '/api/auth/admin/helpseekers';
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        const users = formData.userType === 'helper' ? data.helpers : data.helpseekers;
        const filtered = users.filter(user =>
          user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.includes(searchTerm)
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm && !preSelectedUser) {
        searchUsers();
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm, formData.userType]);

  const selectUser = (user) => {
    setFormData(prev => ({
      ...prev,
      userId: user.id,
    }));
    const displayText = user.phone 
      ? `${user.fullName} (${user.phone})`
      : `${user.fullName} (${user.email})`;
    setSearchTerm(displayText);
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userId) {
      alert('Please select a user to block');
      return;
    }

    if (!formData.reason.trim()) {
      alert('Please provide a reason for blocking');
      return;
    }

    if (formData.blockType === 'temporary' && (!formData.durationHours || formData.durationHours < 1)) {
      alert('Please provide a valid duration for temporary block');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        userId: formData.userId,
        userType: formData.userType,
        blockType: formData.blockType,
        reason: formData.reason,
      };

      if (formData.blockType === 'temporary') {
        payload.durationHours = parseInt(formData.durationHours);
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/blocks/block`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('User blocked successfully');
        onSuccess();
        onClose();
      } else {
        alert(data.message || 'Failed to block user');
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('Failed to block user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><Ban size={24} /> Block User</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="block-form">
          <div className="form-group">
            <label>User Type *</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              disabled={!!preSelectedUser}
              required
            >
              <option value="helper">Helper</option>
              <option value="helpseeker">Helpseeker</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {!preSelectedUser && (
            <div className="form-group">
              <label>Search User *</label>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!!formData.userId}
              />
              {searchLoading && <p className="search-info">Searching...</p>}
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map(user => (
                    <div 
                      key={user.id} 
                      className="search-result-item"
                      onClick={() => selectUser(user)}
                    >
                      <div>
                        <strong>{user.fullName}</strong>
                        <p>{user.email}</p>
                      </div>
                      <span className="user-phone">{user.phone}</span>
                    </div>
                  ))}
                </div>
              )}
              {searchTerm && searchResults.length === 0 && !searchLoading && (
                <p className="search-info">No users found</p>
              )}
            </div>
          )}

          <div className="form-group">
            <label>Block Type *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="blockType"
                  value="temporary"
                  checked={formData.blockType === 'temporary'}
                  onChange={handleInputChange}
                />
                <Clock size={18} />
                <span>Temporary</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="blockType"
                  value="permanent"
                  checked={formData.blockType === 'permanent'}
                  onChange={handleInputChange}
                />
                <Ban size={18} />
                <span>Permanent</span>
              </label>
            </div>
          </div>

          {formData.blockType === 'temporary' && (
            <div className="form-group">
              <label>Duration (Hours) *</label>
              <input
                type="number"
                name="durationHours"
                value={formData.durationHours}
                onChange={handleInputChange}
                min="1"
                max="8760"
                placeholder="Enter duration in hours (max 8760 = 1 year)"
                required
              />
              <p className="field-hint">
                Quick options: 24 hours (1 day), 168 hours (1 week), 720 hours (30 days)
              </p>
            </div>
          )}

          <div className="form-group">
            <label>Reason for Blocking *</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              rows="4"
              placeholder="Enter the reason for blocking this user..."
              required
            />
          </div>

          <div className="warning-box">
            <AlertTriangle size={20} />
            <p>
              {formData.blockType === 'permanent' 
                ? 'This user will be permanently blocked from using the platform until manually unblocked.'
                : `This user will be blocked for ${formData.durationHours || '?'} hours.`
              }
            </p>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Blocking...' : 'Block User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlockUserModal;
