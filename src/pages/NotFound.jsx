import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import '../styles/NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
      
      <div className="notfound-content">
        <div className="error-icon">
          <AlertCircle size={80} />
        </div>
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-description">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <button className="home-button" onClick={() => navigate('/')}>
          <Home size={20} />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
