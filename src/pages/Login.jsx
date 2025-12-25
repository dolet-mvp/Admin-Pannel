import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Shield, ArrowRight, Smartphone } from 'lucide-react';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          ...(requires2FA && { twoFactorCode })
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.requires2FA) {
          setRequires2FA(true);
          setError('');
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('admin', JSON.stringify(data.admin));
          localStorage.setItem('isAuthenticated', 'true');
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="grid-pattern"></div>
      </div>
      
      <div className="login-content">
        <div className="login-left">
          <div className="brand-section">
            <div className="brand-logo">
              <Shield size={40} strokeWidth={2} />
            </div>
            <h1 className="brand-title">Dolet Admin</h1>
            <p className="brand-subtitle">Secure administrative access to manage your platform with confidence</p>
          </div>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div className="feature-text">
                <h4>Real-time Analytics</h4>
                <p>Monitor system performance instantly</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div className="feature-text">
                <h4>User Management</h4>
                <p>Complete control over user accounts</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div className="feature-text">
                <h4>Secure Platform</h4>
                <p>Enterprise-grade security measures</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠</span>
                  {error}
                </div>
              )}

              {requires2FA && (
                <div className="info-message">
                  <Smartphone size={18} />
                  <span>Enter the 6-digit code from your authenticator app</span>
                </div>
              )}

              {!requires2FA ? (
                <>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                      <Mail size={20} className="input-icon" />
                      <input
                        type="email"
                        id="email"
                        placeholder="admin@dolet.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                      <Lock size={20} className="input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label htmlFor="twoFactorCode">Authentication Code</label>
                  <div className="input-wrapper">
                    <Smartphone size={20} className="input-icon" />
                    <input
                      type="text"
                      id="twoFactorCode"
                      placeholder="Enter 6-digit code"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                      autoComplete="one-time-code"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? (
                  <div className="button-loader"></div>
                ) : (
                  <>
                    {requires2FA ? 'Verify Code' : 'Sign In'}
                    <ArrowRight size={20} className="button-arrow" />
                  </>
                )}
              </button>

              {requires2FA && (
                <button 
                  type="button" 
                  className="back-button" 
                  onClick={() => {
                    setRequires2FA(false);
                    setTwoFactorCode('');
                    setError('');
                  }}
                >
                  ← Back to Login
                </button>
              )}
            </form>

            <div className="login-footer">
              <p>Protected by enterprise security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
