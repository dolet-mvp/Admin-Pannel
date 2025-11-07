import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield, Clock } from 'lucide-react';
import '../styles/Profile.css';

const Profile = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  if (!admin) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Admin Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          {admin.profilePhoto ? (
            <img src={admin.profilePhoto} alt={admin.fullName} />
          ) : (
            <div className="avatar-placeholder">
              <User size={48} />
            </div>
          )}
        </div>

        <div className="profile-info">
          <h2>{admin.fullName}</h2>
          <div className="profile-badge">
            <Shield size={16} />
            <span>{admin.role.toUpperCase()}</span>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <div className="detail-icon">
              <Mail size={20} />
            </div>
            <div className="detail-content">
              <label>Email Address</label>
              <p>{admin.email}</p>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Phone size={20} />
            </div>
            <div className="detail-content">
              <label>Phone Number</label>
              <p>{admin.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Calendar size={20} />
            </div>
            <div className="detail-content">
              <label>Account Created</label>
              <p>{formatDate(admin.createdAt)}</p>
            </div>
          </div>

      

        </div>
      </div>
    </div>
  );
};

export default Profile;
