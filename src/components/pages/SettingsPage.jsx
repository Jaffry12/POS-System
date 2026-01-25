import { useTheme } from "../../context/ThemeContext";
import { SETTINGS } from "../../data/menuData";
import { FiDownload, FiTrash2 } from "react-icons/fi";

const SettingsPage = () => {
  const { theme } = useTheme();

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
  };

  const styles = {
    container: {
      height: "100vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    scrollableContent: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: "0 40px 80px 40px",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    header: {
      padding: "40px 40px 0 40px",
      marginBottom: "32px",
      flexShrink: 0,
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
    },
    settingLabel: {
      fontSize: "14px",
      fontWeight: "500",
      color: theme.textPrimary,
    },
    settingValue: {
      fontSize: "14px",
      color: theme.textSecondary,
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
      gap: "10px",
    },
    primaryButton: {
      background: theme.primary,
      color: "#FFFFFF",
    },
    dangerButton: {
      background: theme.danger,
      color: "#FFFFFF",
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
  };

  return (
    <>
      <style>{`
        .settings-scroll::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }
      `}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>Settings</div>
          <div style={styles.subtitle}>Configure your POS system</div>
        </div>

        <div className="settings-scroll" style={styles.scrollableContent}>
          {/* Shop Information */}
          <div style={styles.section}>
        <div style={styles.sectionTitle}>Shop Information</div>
        <div style={styles.settingRow}>
          <div style={styles.settingLabel}>Shop Name</div>
          <div style={styles.settingValue}>{SETTINGS.shopName}</div>
        </div>
        <div style={styles.settingRow}>
          <div style={styles.settingLabel}>Subtitle</div>
          <div style={styles.settingValue}>{SETTINGS.shopSubtitle}</div>
        </div>
        <div style={styles.settingRow}>
          <div style={styles.settingLabel}>Currency</div>
          <div style={styles.settingValue}>{SETTINGS.currency}</div>
        </div>
        <div style={styles.settingRow}>
          <div style={styles.settingLabel}>Tax Rate</div>
          <div style={styles.settingValue}>
            {(SETTINGS.taxRate * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Data Management</div>
        <p style={{ color: theme.textSecondary, fontSize: "14px", marginBottom: "16px" }}>
          Export your transaction data or clear all records from the system.
        </p>

        <div style={styles.buttonGroup}>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={handleExportData}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <FiDownload style={styles.icon} />
            Export Data
          </button>

          <button
            style={{ ...styles.button, ...styles.dangerButton }}
            onClick={handleClearData}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <FiTrash2 style={styles.icon} />
            Clear All Data
          </button>
        </div>
      </div>

      {/* System Info */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>System Information</div>
        <div style={styles.settingRow}>
          <div style={styles.settingLabel}>Version</div>
          <div style={styles.settingValue}>1.0.0</div>
        </div>
        <div style={styles.settingRow}>
          <div style={styles.settingLabel}>Last Updated</div>
          <div style={styles.settingValue}>January 2026</div>
        </div>
      </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;