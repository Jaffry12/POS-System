import { useNavigate, useLocation } from "react-router-dom";
import * as Icons from "lucide-react";
import { Moon, Sun, ChefHat, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { NAVIGATION_ITEMS, SETTINGS } from "../../data/menuData";

const Sidebar = ({ isOpen = true, onClose = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth <= 1024) onClose();
  };

  const styles = {
    sidebar: {
      width: "240px",
      height: "100svh", // ✅ iOS safe viewport height (better than 100vh)
      background: theme.bgSidebar,
      borderRight: `1px solid ${theme.border}`,
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 160,
      transition: "transform 0.3s ease",
      overflow: "hidden", // ✅ sidebar doesn't scroll (nav will)
      minHeight: 0,
      paddingBottom: "env(safe-area-inset-bottom)", // ✅ iPhone bottom safe area
    },

    header: {
      padding: "24px 20px",
      borderBottom: `1px solid ${theme.border}`,
      flexShrink: 0,
      position: "relative",
    },

    closeButton: {
      position: "absolute",
      top: "20px",
      right: "16px",
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      border: "none",
      background: "transparent",
      color: theme.textPrimary,
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",
      zIndex: 10,
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

    shopInfo: { flex: 1, minWidth: 0 },

    shopName: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.textPrimary,
      marginBottom: "2px",
      lineHeight: "1.2",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },

    shopSubtitle: {
      fontSize: "12px",
      color: theme.textSecondary,
      lineHeight: "1.2",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },

    // ✅ ONLY NAV SCROLLS
    nav: {
      flex: "1 1 auto",
      padding: "20px 12px",
      overflowY: "auto",
      minHeight: 0,
      WebkitOverflowScrolling: "touch",
    },

    navItem: (isActive) => ({
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      margin: "4px 0",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      background: isActive ? theme.success : "transparent",
      color: isActive ? "#FFFFFF" : theme.textSecondary,
      userSelect: "none",
    }),

    navIcon: { width: "20px", height: "20px" },
    navLabel: { fontSize: "14px", fontWeight: "500" },

    // ✅ fixed section above theme toggle (always visible)
    mascot: {
      padding: "12px 20px",
      textAlign: "center",
      flexShrink: 0,
      borderTop: `1px solid ${theme.border}`,
      background: theme.bgSidebar,
    },

    mascotIcon: {
      width: "56px",
      height: "56px",
      color: theme.success,
      opacity: 0.85,
    },

    // ✅ NO sticky (fixes iOS issue) — always visible
    themeToggle: {
      padding: "14px 16px",
      borderTop: `1px solid ${theme.border}`,
      display: "flex",
      gap: "8px",
      flexShrink: 0,
      background: theme.bgSidebar,
      paddingBottom: "calc(14px + env(safe-area-inset-bottom))",
    },

    themeButton: (active) => ({
      flex: 1,
      padding: "10px",
      borderRadius: "10px",
      border: `1px solid ${active ? "transparent" : theme.border}`,
      background: active ? theme.textSecondary : theme.bgHover,
      color: active ? "#FFFFFF" : theme.textSecondary,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      fontSize: "13px",
      fontWeight: "600",
      transition: "all 0.2s ease",
    }),
  };

  return (
    <>
      <style>{`
        /* Backdrop overlay */
        .sidebar-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          z-index: 150;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        .sidebar-backdrop.open {
          opacity: 1;
          pointer-events: auto;
        }

        /* Sidebar base */
        .sidebar-responsive {
          scrollbar-width: none;
          -ms-overflow-style: none;
          height: 100svh;
          overflow: hidden;
          transform: translateX(0);
        }
        .sidebar-responsive::-webkit-scrollbar { display: none; }

        /* Prefer 100dvh when supported */
        @supports (height: 100dvh) {
          .sidebar-responsive { height: 100dvh; }
        }

        /* Tablet & Mobile drawer */
        @media (max-width: 1024px) {
          .sidebar-responsive {
            transform: translateX(${isOpen ? "0" : "-100%"});
            box-shadow: ${isOpen ? "4px 0 16px rgba(0, 0, 0, 0.20)" : "none"};
          }
          .sidebar-close-button { display: flex !important; }
        }

        /* Mobile sizing */
        @media (max-width: 768px) {
          .sidebar-responsive { width: 280px !important; }
          .sidebar-header-mobile { padding: 18px 56px 18px 16px !important; }
          .sidebar-close-button { top: 18px !important; right: 14px !important; width: 30px !important; height: 30px !important; }
          .sidebar-nav-mobile { padding: 16px 10px !important; }
          .sidebar-theme-toggle-mobile { padding: 12px 12px !important; }
        }

        @media (max-width: 480px) {
          .sidebar-responsive { width: 260px !important; }
          .sidebar-header-mobile { padding: 16px 52px 16px 12px !important; }
          .sidebar-close-button { top: 16px !important; right: 12px !important; width: 28px !important; height: 28px !important; }
          .sidebar-logo-mobile { width: 44px !important; height: 44px !important; }
          .sidebar-shop-name { font-size: 14px !important; }
          .sidebar-shop-subtitle { font-size: 11px !important; }
          .sidebar-mascot-icon { width: 50px !important; height: 50px !important; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside className="sidebar-responsive" style={styles.sidebar} aria-label="Sidebar">
        {/* Header */}
        <div className="sidebar-header-mobile" style={styles.header}>
          <button
            type="button"
            className="sidebar-close-button"
            style={styles.closeButton}
            onClick={onClose}
            aria-label="Close sidebar"
            onMouseEnter={(e) => (e.currentTarget.style.background = theme.bgHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <X size={22} strokeWidth={2} />
          </button>

          <div style={styles.logoContainer} onClick={() => handleNavigation("/")}>
            <div className="sidebar-logo-mobile" style={styles.logo}>
              <img
                src="/215924414_112364024442867_4888141785165175284_n.jpg"
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

        {/* Navigation (scrollable) */}
        <nav className="sidebar-nav-mobile" style={styles.nav}>
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = Icons[item.icon];
            const isActive = location.pathname === item.path;

            return (
              <div
                key={item.id}
                style={styles.navItem(isActive)}
                onClick={() => handleNavigation(item.path)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleNavigation(item.path);
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = theme.bgHover;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                {Icon ? <Icon style={styles.navIcon} /> : null}
                <span style={styles.navLabel}>{item.name}</span>
              </div>
            );
          })}
        </nav>

        {/* Mascot */}
        <div className="sidebar-mascot-mobile" style={styles.mascot}>
          <ChefHat className="sidebar-mascot-icon" style={styles.mascotIcon} />
        </div>

        {/* Theme Toggle (ALWAYS VISIBLE NOW) */}
        <div className="sidebar-theme-toggle-mobile" style={styles.themeToggle}>
          <button
            type="button"
            style={styles.themeButton(!isDark)}
            onClick={() => {
              if (isDark) toggleTheme();
            }}
          >
            <Sun size={16} />
            Light
          </button>

          <button
            type="button"
            style={styles.themeButton(isDark)}
            onClick={() => {
              if (!isDark) toggleTheme();
            }}
          >
            <Moon size={16} />
            Dark
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
