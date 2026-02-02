import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { SETTINGS } from "../../data/menuData";
import { FiDownload, FiTrash2, FiLogOut, FiUser, FiShield } from "react-icons/fi";

const SettingsPage = () => {
  const { theme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all transaction data? This cannot be undone."
      )
    ) {
      localStorage.removeItem("transactions");
      alert("Transaction data cleared successfully!");
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pos-data-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  const styles = {
    container: {
      height: "100vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      background: theme.bgPrimary,
    },
    header: {
      padding: "40px 40px 0 40px",
      marginBottom: "32px",
      flexShrink: 0,
    },
    scrollableContent: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: "0 40px 140px 40px",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    title: {
      fontSize: "32px",
      fontWeight: "700",
      color: theme.textPrimary,
      marginBottom: "8px",
    },
    subtitle: {
      fontSize: "16px",
      color: theme.textSecondary,
    },
    section: {
      background: theme.cardBg,
      borderRadius: "16px",
      padding: "24px",
      marginBottom: "24px",
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: theme.textPrimary,
      marginBottom: "16px",
    },
    settingRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 0",
      borderBottom: `1px solid ${theme.border}`,
      gap: "14px",
    },
    settingLabel: {
      fontSize: "14px",
      fontWeight: "500",
      color: theme.textPrimary,
    },
    settingValue: {
      fontSize: "14px",
      color: theme.textSecondary,
      textAlign: "right",
      wordBreak: "break-word",
    },
    button: {
      padding: "10px 16px",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      whiteSpace: "nowrap",
    },
    primaryButton: {
      background: theme.primary,
      color: "#FFFFFF",
    },
    dangerButton: {
      background: theme.danger,
      color: "#FFFFFF",
    },
    logoutButton: {
      background: '#ef4444',  // Bright red background
      color: '#FFFFFF',
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      marginTop: "16px",
      flexWrap: "wrap",
    },
    icon: {
      fontSize: "18px",
      display: "inline-block",
    },
    userCard: {
      background: theme.bgSecondary,
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "16px",
    },
    userAvatar: {
      width: "56px",
      height: "56px",
      borderRadius: "12px",
      background: theme.success,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: "24px",
      fontWeight: "700",
      flexShrink: 0,
    },
    userInfo: {
      flex: 1,
      minWidth: 0,
    },
    userName: {
      fontSize: "16px",
      fontWeight: "700",
      color: theme.textPrimary,
      marginBottom: "4px",
    },
    userRole: {
      fontSize: "13px",
      fontWeight: "600",
      color: theme.textSecondary,
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    fullWidthButton: {
      width: "100%",
    },
  };

  return (
    <>
      <style>{`
        /* Hide scrollbar */
        .settings-scroll::-webkit-scrollbar {
          display: none;
        }

        /* Tablet: 768px - 1024px */
        @media (max-width: 1024px) and (min-width: 768px) {
          .settings-header {
            padding: 32px 32px 0 32px !important;
            margin-bottom: 28px !important;
          }
          .settings-title {
            font-size: 28px !important;
          }
          .settings-subtitle {
            font-size: 15px !important;
          }
          .settings-scroll {
            padding: 0 32px 140px 32px !important;
          }
          .settings-section {
            padding: 20px !important;
            margin-bottom: 20px !important;
          }
        }

        /* Mobile: <= 768px */
        @media (max-width: 768px) {
          .settings-header {
            padding: 24px 20px 0 20px !important;
            margin-bottom: 20px !important;
          }
          .settings-title {
            font-size: 24px !important;
          }
          .settings-subtitle {
            font-size: 14px !important;
          }
          .settings-scroll {
            padding: 0 20px 100px 20px !important;
          }
          .settings-section {
            padding: 18px !important;
            margin-bottom: 18px !important;
          }
          .settings-section-title {
            font-size: 16px !important;
            margin-bottom: 14px !important;
          }
          .settings-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 12px 0 !important;
            gap: 6px !important;
          }
          .settings-value {
            text-align: left !important;
          }
          .settings-button-group {
            flex-direction: column !important;
            width: 100% !important;
            gap: 10px !important;
          }
          .settings-button {
            width: 100% !important;
          }
          .settings-user-card {
            padding: 16px !important;
            gap: 12px !important;
          }
          .settings-user-avatar {
            width: 48px !important;
            height: 48px !important;
            font-size: 20px !important;
          }
          .settings-user-name {
            font-size: 15px !important;
          }
          .settings-user-role {
            font-size: 12px !important;
          }
        }

        /* Small Mobile: < 480px */
        @media (max-width: 480px) {
          .settings-header {
            padding: 20px 16px 0 16px !important;
            margin-bottom: 16px !important;
          }
          .settings-title {
            font-size: 22px !important;
          }
          .settings-subtitle {
            font-size: 13px !important;
          }
          .settings-scroll {
            padding: 0 16px 100px 16px !important;
          }
          .settings-section {
            padding: 16px !important;
            margin-bottom: 16px !important;
          }
          .settings-section-title {
            font-size: 15px !important;
            margin-bottom: 12px !important;
          }
          .settings-button {
            padding: 10px 14px !important;
            font-size: 13px !important;
            gap: 8px !important;
          }
          .settings-icon {
            font-size: 16px !important;
          }
          .settings-user-card {
            padding: 14px !important;
            gap: 10px !important;
          }
          .settings-user-avatar {
            width: 44px !important;
            height: 44px !important;
            font-size: 18px !important;
          }
          .settings-user-name {
            font-size: 14px !important;
          }
          .settings-user-role {
            font-size: 11px !important;
          }
        }
      `}</style>

      <div style={styles.container} className="settings-container">
        <div style={styles.header} className="settings-header">
          <div style={styles.title} className="settings-title">Settings</div>
          <div style={styles.subtitle} className="settings-subtitle">
            Configure your POS system
          </div>
        </div>

        <div className="settings-scroll" style={styles.scrollableContent}>
          {/* Account Section */}
          <div style={styles.section} className="settings-section">
            <div style={styles.sectionTitle} className="settings-section-title">
              Account
            </div>

            {/* User Info Card */}
            <div style={styles.userCard} className="settings-user-card">
              <div style={styles.userAvatar} className="settings-user-avatar">
                <FiUser />
              </div>
              <div style={styles.userInfo}>
                <div style={styles.userName} className="settings-user-name">
                  {user?.username || 'Admin'}
                </div>
                <div style={styles.userRole} className="settings-user-role">
                  <FiShield size={14} />
                  {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              style={{ ...styles.button, ...styles.logoutButton, ...styles.fullWidthButton }}
              className="settings-button"
              onClick={handleLogout}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <FiLogOut style={styles.icon} className="settings-icon" />
              Logout
            </button>
          </div>

          {/* Shop Information */}
          <div style={styles.section} className="settings-section">
            <div style={styles.sectionTitle} className="settings-section-title">
              Shop Information
            </div>

            <div style={styles.settingRow} className="settings-row">
              <div style={styles.settingLabel} className="settings-label">Shop Name</div>
              <div style={styles.settingValue} className="settings-value">{SETTINGS.shopName}</div>
            </div>

            <div style={styles.settingRow} className="settings-row">
              <div style={styles.settingLabel} className="settings-label">Subtitle</div>
              <div style={styles.settingValue} className="settings-value">{SETTINGS.shopSubtitle}</div>
            </div>

            <div style={styles.settingRow} className="settings-row">
              <div style={styles.settingLabel} className="settings-label">Currency</div>
              <div style={styles.settingValue} className="settings-value">{SETTINGS.currency}</div>
            </div>

            <div style={{ ...styles.settingRow, borderBottom: "none" }} className="settings-row">
              <div style={styles.settingLabel} className="settings-label">Tax Rate</div>
              <div style={styles.settingValue} className="settings-value">
                {(SETTINGS.taxRate * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div style={styles.section} className="settings-section">
            <div style={styles.sectionTitle} className="settings-section-title">
              Data Management
            </div>

            <p style={{ color: theme.textSecondary, fontSize: "14px", marginBottom: "16px" }}>
              Export your transaction data or clear all records from the system.
            </p>

            <div style={styles.buttonGroup} className="settings-button-group">
              <button
                style={{ ...styles.button, ...styles.primaryButton }}
                className="settings-button"
                onClick={handleExportData}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <FiDownload style={styles.icon} className="settings-icon" />
                Export Data
              </button>

              <button
                style={{ ...styles.button, ...styles.dangerButton }}
                className="settings-button"
                onClick={handleClearData}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <FiTrash2 style={styles.icon} className="settings-icon" />
                Clear All Data
              </button>
            </div>
          </div>

          {/* System Info */}
          <div style={styles.section} className="settings-section">
            <div style={styles.sectionTitle} className="settings-section-title">
              System Information
            </div>

            <div style={styles.settingRow} className="settings-row">
              <div style={styles.settingLabel} className="settings-label">Version</div>
              <div style={styles.settingValue} className="settings-value">1.0.0</div>
            </div>

            <div style={{ ...styles.settingRow, borderBottom: "none" }} className="settings-row">
              <div style={styles.settingLabel} className="settings-label">Last Updated</div>
              <div style={styles.settingValue} className="settings-value">February 2026</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;