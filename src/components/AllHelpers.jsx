import { useState, useEffect } from 'react';
import { Phone, Search, Star, Calendar } from 'lucide-react';
import SkeletonCard from './SkeletonCard';
import '../styles/AllHelpers.css';

const AllHelpers = () => {
  const [helpers, setHelpers] = useState([]);
  const [filteredHelpers, setFilteredHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllHelpers();
  }, []);

  const fetchAllHelpers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/helpers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setHelpers(data.helpers || []);
        setFilteredHelpers(data.helpers || []);
      }
    } catch (error) {
      console.error('Error fetching helpers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredHelpers(helpers);
    } else {
      const filtered = helpers.filter(helper =>
        (helper.fullName && helper.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (helper.phone && helper.phone.includes(searchTerm)) ||
        (helper.email && helper.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredHelpers(filtered);
    }
  }, [searchTerm, helpers]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="all-helpers">
        <h2>All Helpers</h2>
        <div className="helpers-grid">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="all-helpers">
      <div className="section-header">
        <div>
          <h2>All Helpers</h2>
          <p className="helper-count">{filteredHelpers.length} Helpers</p>
        </div>
        
        <div className="search-filter">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search helpers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredHelpers.length === 0 ? (
        <div className="empty-state">
          <p>No helpers found</p>
        </div>
      ) : (
        <div className="helpers-grid">
          {filteredHelpers.map((helper) => (
            <div key={helper.id} className="helper-card">
              <div className="card-header">
                <div className="helper-avatar">
                  {helper.fullName ? helper.fullName.split(' ').map(n => n[0]).join('') : helper.phone.slice(0, 2)}
                </div>
                <div className={`status-badge ${helper.isApproved ? 'active' : 'inactive'}`}>
                  {helper.isApproved ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="helper-info">
                <h3>{helper.fullName || 'Helper'}</h3>
                
                {helper.email && (
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span>{helper.email}</span>
                  </div>
                )}
                
                <div className="info-item">
                  <Phone size={14} />
                  <span>{helper.phone}</span>
                </div>

                <div className="info-item">
                  <Calendar size={14} />
                  <span>Joined: {formatDate(helper.createdAt)}</span>
                </div>

                <div className="stats-row">
                  <div className="stat-item">
                    <Star size={16} fill="#FFD700" color="#FFD700" />
                    <span>{parseFloat(helper.averageRating).toFixed(1)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Tasks:</span>
                    <span className="stat-value">{helper.completedTasks}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Earnings:</span>
                    <span className="stat-value">{parseFloat(helper.totalEarnings).toFixed(2)}</span>
                  </div>
                </div>

                {helper.isVerified && (
                  <div className="verified-badge">
                     Verified
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllHelpers;
