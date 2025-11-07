import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PendingApprovals from '../components/PendingApprovals';
import AllHelpers from '../components/AllHelpers';
import Profile from './Profile';
import { LogOut, Menu, X } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1>Admin Dashboard</h1>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </header>

        <div className="dashboard-content">
          {activeTab === 'pending' && <PendingApprovals />}
          {activeTab === 'all-helpers' && <AllHelpers />}
          {activeTab === 'profile' && <Profile />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
