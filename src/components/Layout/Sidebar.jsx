import { useNavigate, useLocation } from "react-router-dom";
import * as Icons from "lucide-react";
import { Moon, Sun, ChefHat } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { NAVIGATION_ITEMS, SETTINGS } from "../../data/menuData";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, isDark, toggleTheme } = useTheme();

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
    },
    header: {
      padding: "24px 20px",
      borderBottom: `1px solid ${theme.border}`,
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    logo: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      background: theme.primary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    shopInfo: {
      flex: 1,
    },
    shopName: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.textPrimary,
      marginBottom: "2px",
    },
    shopSubtitle: {
      fontSize: "12px",
      color: theme.textSecondary,
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
    <div style={styles.sidebar}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>
            <ChefHat size={24} color="#fff" />
          </div>
          <div style={styles.shopInfo}>
            <div style={styles.shopName}>{SETTINGS.shopName}</div>
            <div style={styles.shopSubtitle}>{SETTINGS.shopSubtitle}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={styles.nav}>
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = Icons[item.icon];
          const isActive = location.pathname === item.path;

          return (
            <div
              key={item.id}
              style={styles.navItem(isActive)}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = theme.bgHover;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon style={styles.navIcon} />
              <span style={styles.navLabel}>{item.name}</span>
            </div>
          );
        })}
      </div>

      {/* Mascot */}
      <div style={styles.mascot}>
        <ChefHat style={styles.mascotIcon} />
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
  );
};

export default Sidebar;
