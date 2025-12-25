import { Users, UserCheck, X, LogOut, User, Shield, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      id: 'pending',
      label: 'Pending Helper Approval',
      icon: UserCheck,
    },
    {
      id: 'all-helpers',
      label: 'All Helpers',
      icon: Users,
    },
    {
      id: 'all-helpseekers',
      label: 'All Helpseekers',
      icon: UserCircle,
    },
    {
      id: 'blocked-users',
      label: 'Blocked Users',
      icon: Shield,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ];

  const handleMenuClick = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <>
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">D</div>
            <h2>Dolet Admin</h2>
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
