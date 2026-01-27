import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useTheme } from '../../context/ThemeContext';

const MainLayout = () => {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    layout: {
      display: 'flex',
      minHeight: '100vh',
      background: theme.bgPrimary,
      position: 'relative',
    },
    
    // Mobile hamburger menu button
    mobileMenuButton: {
      position: 'fixed',
      top: '16px',
      left: '16px',
      zIndex: 200,
      width: '44px',
      height: '44px',
      borderRadius: '10px',
      border: 'none',
      background: theme.success,
      color: '#FFFFFF',
      display: sidebarOpen ? 'none' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.2s ease',
    },
    
    // Overlay for mobile sidebar
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 140,
      opacity: sidebarOpen ? 1 : 0,
      pointerEvents: sidebarOpen ? 'auto' : 'none',
      transition: 'opacity 0.3s ease',
    },
    
    mainContent: {
      marginLeft: '240px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
    },
    
    contentArea: {
      flex: 1,
      overflow: 'auto',
    },
  };

  return (
    <>
      <style>{`
        /* Desktop (default - unchanged) */
        .main-content-layout {
          margin-left: 240px;
        }

        .mobile-menu-button {
          display: none;
        }

        /* Tablet & Mobile: Show hamburger, remove margin */
        @media (max-width: 1024px) {
          .mobile-menu-button {
            display: ${sidebarOpen ? 'none' : 'flex'} !important;
          }
          
          .main-content-layout {
            margin-left: 0 !important;
          }
        }

        /* Mobile: Adjust button position */
        @media (max-width: 768px) {
          .mobile-menu-button {
            top: 12px !important;
            left: 12px !important;
            width: 42px !important;
            height: 42px !important;
          }
        }

        /* Small Mobile: Even smaller button */
        @media (max-width: 480px) {
          .mobile-menu-button {
            width: 40px !important;
            height: 40px !important;
          }
        }
      `}</style>

      <div style={styles.layout}>
        {/* Mobile Hamburger Menu Button - Only shows hamburger icon */}
        <button
          className="mobile-menu-button"
          style={styles.mobileMenuButton}
          onClick={() => setSidebarOpen(true)}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Menu size={22} />
        </button>

        {/* Mobile Overlay */}
        <div 
          style={styles.overlay} 
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar (Desktop: Always visible, Mobile: Drawer) */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main Content Area */}
        <div 
          className="main-content-layout"
          style={styles.mainContent}
        >
          <TopBar />
          <div style={styles.contentArea}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;