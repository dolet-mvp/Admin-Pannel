import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield, Lock, Save, X, Eye, EyeOff, Edit2, Smartphone, QrCode } from 'lucide-react';
import '../styles/Profile.css';

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [twoFactorMode, setTwoFactorMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 2FA state
  const [twoFactorData, setTwoFactorData] = useState({
    qrCode: null,
    secret: null,
    verificationCode: '',
    disablePassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      const parsedAdmin = JSON.parse(adminData);
      setAdmin(parsedAdmin);
      setProfileForm({
        fullName: parsedAdmin.fullName || '',
        email: parsedAdmin.email || '',
        phone: parsedAdmin.phone || ''
      });
    }
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });

      const data = await response.json();

      if (data.success) {
        const updatedAdmin = { ...admin, ...profileForm };
        setAdmin(updatedAdmin);
        localStorage.setItem('admin', JSON.stringify(updatedAdmin));
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setEditMode(false);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters!' });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/profile/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setChangePasswordMode(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate2FA = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/2fa/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setTwoFactorData({
          ...twoFactorData,
          qrCode: data.qrCode,
          secret: data.secret
        });
        setTwoFactorMode(true);
        setMessage({ type: 'success', text: 'Scan QR code with Google Authenticator app' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to generate 2FA' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
      console.error('Generate 2FA error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/2fa/enable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: twoFactorData.verificationCode
        })
      });

      const data = await response.json();

      if (data.success) {
        const updatedAdmin = { ...admin, twoFactorEnabled: true };
        setAdmin(updatedAdmin);
        localStorage.setItem('admin', JSON.stringify(updatedAdmin));
        setMessage({ type: 'success', text: '2FA enabled successfully!' });
        setTwoFactorMode(false);
        setTwoFactorData({
          qrCode: null,
          secret: null,
          verificationCode: '',
          disablePassword: ''
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Invalid verification code' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
      console.error('Enable 2FA error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/2fa/disable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: twoFactorData.disablePassword
        })
      });

      const data = await response.json();

      if (data.success) {
        const updatedAdmin = { ...admin, twoFactorEnabled: false };
        setAdmin(updatedAdmin);
        localStorage.setItem('admin', JSON.stringify(updatedAdmin));
        setMessage({ type: 'success', text: '2FA disabled successfully!' });
        setTwoFactorData({
          qrCode: null,
          secret: null,
          verificationCode: '',
          disablePassword: ''
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to disable 2FA' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
      console.error('Disable 2FA error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!admin) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
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
        <div>
          <h1>Admin Profile</h1>
          <p>Manage your account information and security</p>
        </div>
      </div>

      {message.text && (
        <div className={`message-alert ${message.type}`}>
          {message.text}
          <button onClick={() => setMessage({ type: '', text: '' })}>
            <X size={18} />
          </button>
        </div>
      )}

      <div className="profile-content">
        {/* Profile Information Card */}
        <div className="profile-card">
          <div className="card-header">
            <div className="profile-avatar-section">
              <div className="avatar-circle">
                <User size={48} />
              </div>
              <div className="profile-name">
                <h2>{admin.fullName}</h2>
                <span className="role-badge">
                  <Shield size={14} />
                  {admin.role || 'Admin'}
                </span>
              </div>
            </div>
            {!editMode && !changePasswordMode && (
              <button className="edit-btn" onClick={() => setEditMode(true)}>
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}
          </div>

          {!editMode ? (
            <div className="profile-details">
              <div className="detail-item">
                <User className="detail-icon" />
                <div>
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{admin.fullName}</span>
                </div>
              </div>

              <div className="detail-item">
                <Mail className="detail-icon" />
                <div>
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{admin.email}</span>
                </div>
              </div>

              <div className="detail-item">
                <Phone className="detail-icon" />
                <div>
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{admin.phone || 'Not provided'}</span>
                </div>
              </div>

              <div className="detail-item">
                <Calendar className="detail-icon" />
                <div>
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">{formatDate(admin.createdAt)}</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate} className="edit-form">
              <div className="form-group">
                <label>
                  <User size={18} />
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>
                  <Mail size={18} />
                  Email
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>
                  <Phone size={18} />
                  Phone
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={loading}>
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => {
                    setEditMode(false);
                    setProfileForm({
                      fullName: admin.fullName || '',
                      email: admin.email || '',
                      phone: admin.phone || ''
                    });
                  }}
                  disabled={loading}
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change Password Card */}
        <div className="profile-card">
          <div className="card-header">
            <div>
              <h3>
                <Lock size={20} />
                Security Settings
              </h3>
              <p>Update your password to keep your account secure</p>
            </div>
          </div>

          {!changePasswordMode ? (
            <div className="password-section">
              <div className="password-info">
                <Lock className="lock-icon" />
                <div>
                  <h4>Password</h4>
                  <p>Last changed: {formatDate(admin.updatedAt || admin.createdAt)}</p>
                </div>
              </div>
              <button 
                className="change-password-btn" 
                onClick={() => setChangePasswordMode(true)}
                disabled={editMode}
              >
                Change Password
              </button>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label>
                  <Lock size={18} />
                  Current Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    disabled={loading}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Lock size={18} />
                  New Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    disabled={loading}
                    placeholder="Enter new password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Lock size={18} />
                  Confirm New Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                    disabled={loading}
                    placeholder="Confirm new password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={loading}>
                  <Save size={18} />
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => {
                    setChangePasswordMode(false);
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setShowPasswords({ current: false, new: false, confirm: false });
                  }}
                  disabled={loading}
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Two-Factor Authentication Card */}
        <div className="profile-card">
          <div className="card-header">
            <div>
              <h3>
                <Smartphone size={20} />
                Two-Factor Authentication
              </h3>
              <p>Add an extra layer of security to your account</p>
            </div>
          </div>

          <div className="twofa-section">
            {!admin.twoFactorEnabled ? (
              !twoFactorMode ? (
                <div className="twofa-disabled">
                  <div className="twofa-info">
                    <Shield className="twofa-icon disabled" />
                    <div>
                      <h4>2FA is currently disabled</h4>
                      <p>Enable two-factor authentication to secure your account with Google Authenticator</p>
                    </div>
                  </div>
                  <button 
                    className="enable-twofa-btn" 
                    onClick={handleGenerate2FA}
                    disabled={editMode || changePasswordMode || loading}
                  >
                    <Smartphone size={18} />
                    Enable 2FA
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnable2FA} className="twofa-setup-form">
                  <div className="qr-code-section">
                    <h4>
                      <QrCode size={20} />
                      Scan QR Code
                    </h4>
                    <p>Scan this QR code with Google Authenticator app</p>
                    {twoFactorData.qrCode && (
                      <div className="qr-code-wrapper">
                        <img src={twoFactorData.qrCode} alt="2FA QR Code" />
                      </div>
                    )}
                    <div className="secret-key">
                      <span>Manual Entry Key:</span>
                      <code>{twoFactorData.secret}</code>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      <Lock size={18} />
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={twoFactorData.verificationCode}
                      onChange={(e) => setTwoFactorData({ ...twoFactorData, verificationCode: e.target.value })}
                      placeholder="Enter 6-digit code"
                      required
                      disabled={loading}
                      maxLength={6}
                      pattern="[0-9]{6}"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-btn" disabled={loading}>
                      <Save size={18} />
                      {loading ? 'Verifying...' : 'Enable 2FA'}
                    </button>
                    <button 
                      type="button" 
                      className="cancel-btn" 
                      onClick={() => {
                        setTwoFactorMode(false);
                        setTwoFactorData({
                          qrCode: null,
                          secret: null,
                          verificationCode: '',
                          disablePassword: ''
                        });
                      }}
                      disabled={loading}
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </form>
              )
            ) : (
              <div className="twofa-enabled">
                <div className="twofa-info">
                  <Shield className="twofa-icon enabled" />
                  <div>
                    <h4>2FA is enabled</h4>
                    <p>Your account is protected with two-factor authentication</p>
                  </div>
                </div>
                <div className="disable-twofa-form">
                  <h4>Disable Two-Factor Authentication</h4>
                  <p>Enter your password to disable 2FA</p>
                  <form onSubmit={handleDisable2FA}>
                    <div className="form-group">
                      <label>
                        <Lock size={18} />
                        Password
                      </label>
                      <input
                        type="password"
                        value={twoFactorData.disablePassword}
                        onChange={(e) => setTwoFactorData({ ...twoFactorData, disablePassword: e.target.value })}
                        placeholder="Enter your password"
                        required
                        disabled={loading}
                      />
                    </div>
                    <button type="submit" className="disable-btn" disabled={loading || editMode || changePasswordMode}>
                      <X size={18} />
                      {loading ? 'Disabling...' : 'Disable 2FA'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
