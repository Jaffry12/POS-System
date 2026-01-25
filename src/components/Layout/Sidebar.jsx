import { useNavigate, useLocation } from "react-router-dom";
import * as Icons from "lucide-react";
import { Moon, Sun, ChefHat } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { NAVIGATION_ITEMS, SETTINGS } from "../../data/menuData";

const Sidebar = ({ isOpen = true, onClose = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleNavigation = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 1024) {
      onClose();
    }
  };

  const styles = {
    sidebar: {
      width: "240px",
      height: "100vh",
      background: theme.bgSidebar,
      borderRight: `1px solid ${theme.border}`,
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 100,
      transition: "transform 0.3s ease",
    },
    header: {
      padding: "24px 20px",
      borderBottom: `1px solid ${theme.border}`,
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      cursor: "pointer",
    },
    logo: {
      width: "52px",
      height: "52px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      flexShrink: 0,
      background: "transparent",
    },
    logoImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "50%",
      display: "block",
    },
    shopInfo: {
      flex: 1,
      minWidth: 0,
    },
    shopName: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.textPrimary,
      marginBottom: "2px",
      lineHeight: "1.2",
    },
    shopSubtitle: {
      fontSize: "12px",
      color: theme.textSecondary,
      lineHeight: "1.2",
    },
    nav: {
      flex: 1,
      padding: "20px 12px",
      overflowY: "auto",
    },
    navItem: (isActive) => ({
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      margin: "4px 0",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      background: isActive ? theme.success : "transparent",
      color: isActive ? "#FFFFFF" : theme.textSecondary,
    }),
    navIcon: {
      width: "20px",
      height: "20px",
    },
    navLabel: {
      fontSize: "14px",
      fontWeight: "500",
    },
    mascot: {
      padding: "20px",
      textAlign: "center",
    },
    mascotIcon: {
      width: "64px",
      height: "64px",
      color: theme.success,
      opacity: 0.8,
    },
    themeToggle: {
      padding: "16px 20px",
      borderTop: `1px solid ${theme.border}`,
      display: "flex",
      gap: "8px",
    },
    themeButton: (active) => ({
      flex: 1,
      padding: "8px",
      borderRadius: "6px",
      border: "none",
      background: active ? theme.textSecondary : theme.bgHover,
      color: active ? "#FFFFFF" : theme.textSecondary,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      fontSize: "13px",
      fontWeight: "500",
      transition: "all 0.2s ease",
    }),
  };

  return (
    <>
      <style>{`
        /* Desktop View (default - unchanged) */
        .sidebar-responsive {
          transform: translateX(0);
        }

        /* Tablet & Mobile: Drawer behavior */
        @media (max-width: 1024px) {
          .sidebar-responsive {
            transform: translateX(${isOpen ? '0' : '-100%'});
            z-index: 150 !important;
            box-shadow: ${isOpen ? '4px 0 12px rgba(0, 0, 0, 0.15)' : 'none'};
          }
        }

        /* Mobile: Smaller logo & padding */
        @media (max-width: 768px) {
          .sidebar-responsive {
            width: 260px !important;
          }
          
          .sidebar-header-mobile {
            padding: 20px 16px !important;
          }
          
          .sidebar-nav-mobile {
            padding: 16px 10px !important;
          }
          
          .sidebar-mascot-mobile {
            padding: 16px !important;
          }
        }

        /* Small Mobile: Even more compact */
        @media (max-width: 480px) {
          .sidebar-responsive {
            width: 240px !important;
          }
          
          .sidebar-logo-mobile {
            width: 44px !important;
            height: 44px !important;
          }
          
          .sidebar-shop-name {
            font-size: 14px !important;
          }
          
          .sidebar-shop-subtitle {
            font-size: 11px !important;
          }
          
          .sidebar-mascot-icon {
            width: 52px !important;
            height: 52px !important;
          }
        }
      `}</style>

      <div className="sidebar-responsive" style={styles.sidebar}>
        {/* Header */}
        <div className="sidebar-header-mobile" style={styles.header}>
          <div style={styles.logoContainer} onClick={() => handleNavigation("/")}>
            <div className="sidebar-logo-mobile" style={styles.logo}>
              <img
                src="/logo.png"
                alt={SETTINGS.shopName}
                style={styles.logoImg}
              />
            </div>
            <div style={styles.shopInfo}>
              <div className="sidebar-shop-name" style={styles.shopName}>
                {SETTINGS.shopName}
              </div>
              <div className="sidebar-shop-subtitle" style={styles.shopSubtitle}>
                {SETTINGS.shopSubtitle}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="sidebar-nav-mobile" style={styles.nav}>
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = Icons[item.icon];
            const isActive = location.pathname === item.path;

            return (
              <div
                key={item.id}
                style={styles.navItem(isActive)}
                onClick={() => handleNavigation(item.path)}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = theme.bgHover;
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon style={styles.navIcon} />
                <span style={styles.navLabel}>{item.name}</span>
              </div>
            );
          })}
        </div>

        {/* Mascot */}
        <div className="sidebar-mascot-mobile" style={styles.mascot}>
          <ChefHat className="sidebar-mascot-icon" style={styles.mascotIcon} />
        </div>

        {/* Theme Toggle */}
        <div style={styles.themeToggle}>
          <button
            style={styles.themeButton(!isDark)}
            onClick={() => !isDark || toggleTheme()}
          >
            <Sun size={16} />
            Light
          </button>
          <button
            style={styles.themeButton(isDark)}
            onClick={() => isDark || toggleTheme()}
          >
            <Moon size={16} />
            Dark
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;