import { useState, useEffect } from 'react';
import { Phone, Search, Star, Calendar, Eye } from 'lucide-react';
import SkeletonCard from './SkeletonCard';
import HelpseekerDetailsModal from './HelpseekerDetailsModal';
import '../styles/AllHelpseekers.css';

const AllHelpseekers = () => {
  const [helpseekers, setHelpseekers] = useState([]);
  const [filteredHelpseekers, setFilteredHelpseekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHelpseekerId, setSelectedHelpseekerId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchAllHelpseekers();
  }, []);

  const fetchAllHelpseekers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/helpseekers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setHelpseekers(data.helpseekers || []);
        setFilteredHelpseekers(data.helpseekers || []);
      }
    } catch (error) {
      console.error('Error fetching helpseekers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredHelpseekers(helpseekers);
    } else {
      const filtered = helpseekers.filter(helpseeker =>
        (helpseeker.fullName && helpseeker.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (helpseeker.phone && helpseeker.phone.includes(searchTerm)) ||
        (helpseeker.email && helpseeker.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredHelpseekers(filtered);
    }
  }, [searchTerm, helpseekers]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewDetails = (helpseekerId) => {
    setSelectedHelpseekerId(helpseekerId);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="all-helpseekers">
        <h2>All Helpseekers</h2>
        <div className="helpseekers-grid">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="all-helpseekers">
      <div className="section-header">
        <div>
          <h2>All Helpseekers</h2>
          <p className="helpseeker-count">{filteredHelpseekers.length} Helpseekers</p>
        </div>
        
        <div className="search-filter">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search helpseekers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredHelpseekers.length === 0 ? (
        <div className="empty-state">
          <p>No helpseekers found</p>
        </div>
      ) : (
        <div className="helpseekers-grid">
          {filteredHelpseekers.map((helpseeker) => (
            <div key={helpseeker.id} className="helpseeker-card">
              <div className="card-header">
                <div className="helpseeker-avatar">
                  {helpseeker.fullName ? helpseeker.fullName.split(' ').map(n => n[0]).join('') : helpseeker.phone.slice(0, 2)}
                </div>
                <div className="status-badge active">
                  Active
                </div>
              </div>

              <div className="helpseeker-info">
                <h3>{helpseeker.fullName || 'Helpseeker'}</h3>
                
                {helpseeker.email && (
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span>{helpseeker.email}</span>
                  </div>
                )}
                
                <div className="info-item">
                  <Phone size={14} />
                  <span>{helpseeker.phone}</span>
                </div>

                <div className="info-item">
                  <Calendar size={14} />
                  <span>Joined: {formatDate(helpseeker.createdAt)}</span>
                </div>

                <div className="stats-row">
                  <div className="stat-item">
                    <span className="stat-label">Tasks Posted:</span>
                    <span className="stat-value">{helpseeker.totalTasks || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Completed:</span>
                    <span className="stat-value">{helpseeker.completedTasks || 0}</span>
                  </div>
                </div>
              </div>

              <button 
                className="view-details-btn"
                onClick={() => handleViewDetails(helpseeker.id)}
              >
                <Eye size={16} />
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {showDetailsModal && selectedHelpseekerId && (
        <HelpseekerDetailsModal
          helpseekerId={selectedHelpseekerId}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedHelpseekerId(null);
          }}
        />
      )}
    </div>
  );
};

export default AllHelpseekers;
