import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { SETTINGS } from "../../data/menuData";
import { DollarSign, ShoppingCart, TrendingUp, FileText } from "lucide-react";

const BillsPage = () => {
  const { theme } = useTheme();

  const [stats] = useState(() => {
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

    const totalSales = transactions.reduce((sum, t) => {
      const subtotal = t.items.reduce((s, item) => s + item.price * item.quantity, 0);
      const tax = subtotal * SETTINGS.taxRate;
      const discount = t.discount ? (subtotal * t.discount) / 100 : 0;
      return sum + (subtotal + tax - discount);
    }, 0);

    const totalOrders = transactions.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    return { totalSales, totalOrders, avgOrderValue };
  });

  const styles = {
    // ✅ dvh + safe-area so iPhone bottom bar never cuts content
    container: {
      minHeight: "100dvh",
      height: "100dvh",
      overflow: "hidden",
      background: theme.bgPrimary,
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      paddingBottom: "env(safe-area-inset-bottom)",
    },
    header: {
      padding: "40px 40px 0 40px",
      marginBottom: "32px",
      flexShrink: 0,
      boxSizing: "border-box",
    },
    // ✅ Only THIS scrolls + extra bottom padding for long content
    scrollableContent: {
      flex: "1 1 auto",
      minHeight: 0,
      overflowY: "auto",
      overflowX: "hidden",
      padding: "0 40px calc(96px + env(safe-area-inset-bottom)) 40px",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      WebkitOverflowScrolling: "touch",
      boxSizing: "border-box",
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
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "24px",
      marginBottom: "32px",
    },
    statCard: {
      background: theme.cardBg,
      borderRadius: "16px",
      padding: "24px",
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
    },
    statLabel: {
      fontSize: "14px",
      color: theme.textSecondary,
      marginBottom: "8px",
      fontWeight: "600",
    },
    statValue: {
      fontSize: "32px",
      fontWeight: "700",
      color: theme.success,
    },
    statIcon: {
      width: "42px",
      height: "42px",
      marginBottom: "12px",
      color: theme.success,
    },
    content: {
      background: theme.cardBg,
      borderRadius: "16px",
      padding: "40px",
      textAlign: "center",
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
    },
    icon: {
      width: "56px",
      height: "56px",
      margin: "0 auto 20px",
      color: theme.success,
    },
    message: {
      fontSize: "18px",
      color: theme.textSecondary,
      marginBottom: "16px",
      fontWeight: "600",
    },
    description: {
      fontSize: "14px",
      color: theme.textLight,
      maxWidth: "600px",
      margin: "0 auto",
      lineHeight: "1.6",
    },
    featureList: {
      textAlign: "left",
      maxWidth: "500px",
      margin: "24px auto 0",
      padding: "0 20px",
    },
    featureItem: {
      fontSize: "14px",
      color: theme.textSecondary,
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    checkIcon: {
      width: "18px",
      height: "18px",
      color: theme.success,
      flexShrink: 0,
    },
  };

  return (
    <div style={styles.container} className="bills-container">
      <style>{`
        .bills-scroll::-webkit-scrollbar { display: none; }

        /* ✅ Fallback if dvh not supported */
        @supports not (height: 100dvh) {
          .bills-container { height: 100vh !important; min-height: 100vh !important; }
        }

        /* ✅ extra safe-area bottom padding (prevents cut off) */
        .bills-scroll {
          padding-bottom: calc(96px + env(safe-area-inset-bottom)) !important;
        }

        /* Tablet: 768px - 1024px */
        @media (max-width: 1024px) and (min-width: 768px) {
          .bills-header {
            padding: 32px 32px 0 32px !important;
            margin-bottom: 28px !important;
          }
          .bills-title { font-size: 28px !important; }
          .bills-subtitle { font-size: 15px !important; }
          .bills-scroll {
            padding: 0 32px calc(84px + env(safe-area-inset-bottom)) 32px !important;
          }
          .bills-stats-grid { gap: 20px !important; }
          .bills-stat-card { padding: 20px !important; }
          .bills-content { padding: 32px !important; }
        }

        /* Mobile: <= 768px */
        @media (max-width: 768px) {
          .bills-header {
            padding: 24px 20px 0 20px !important;
            margin-bottom: 24px !important;
          }
          .bills-title { font-size: 24px !important; }
          .bills-subtitle { font-size: 14px !important; }
          .bills-scroll {
            padding: 0 20px calc(84px + env(safe-area-inset-bottom)) 20px !important;
          }
          .bills-stats-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            margin-bottom: 24px !important;
          }
          .bills-stat-card { padding: 18px !important; }
          .bills-stat-icon {
            width: 36px !important;
            height: 36px !important;
            margin-bottom: 10px !important;
          }
          .bills-stat-label { font-size: 13px !important; }
          .bills-stat-value { font-size: 26px !important; }
          .bills-content { padding: 24px !important; }
          .bills-icon {
            width: 48px !important;
            height: 48px !important;
            margin-bottom: 16px !important;
          }
          .bills-message { font-size: 16px !important; }
          .bills-description { font-size: 13px !important; }
          .bills-feature-list {
            padding: 0 16px !important;
            margin-top: 20px !important;
          }
          .bills-feature-item {
            font-size: 13px !important;
            margin-bottom: 10px !important;
          }
        }

        /* Small Mobile: < 480px */
        @media (max-width: 480px) {
          .bills-header {
            padding: 20px 16px 0 16px !important;
            margin-bottom: 20px !important;
          }
          .bills-title { font-size: 22px !important; }
          .bills-subtitle { font-size: 13px !important; }
          .bills-scroll {
            padding: 0 16px calc(84px + env(safe-area-inset-bottom)) 16px !important;
          }
          .bills-stats-grid { gap: 14px !important; margin-bottom: 20px !important; }
          .bills-stat-card { padding: 16px !important; }
          .bills-stat-icon {
            width: 32px !important;
            height: 32px !important;
            margin-bottom: 8px !important;
          }
          .bills-stat-label { font-size: 12px !important; margin-bottom: 6px !important; }
          .bills-stat-value { font-size: 24px !important; }
          .bills-content { padding: 20px !important; }
          .bills-icon {
            width: 44px !important;
            height: 44px !important;
            margin-bottom: 14px !important;
          }
          .bills-message { font-size: 15px !important; margin-bottom: 14px !important; }
          .bills-description { font-size: 12px !important; }
          .bills-feature-list { padding: 0 12px !important; margin-top: 18px !important; }
          .bills-feature-item { font-size: 12px !important; margin-bottom: 8px !important; gap: 8px !important; }
          .bills-check-icon { width: 16px !important; height: 16px !important; }
        }
      `}</style>

      <div style={styles.header} className="bills-header">
        <div style={styles.title} className="bills-title">Bills & Reports</div>
        <div style={styles.subtitle} className="bills-subtitle">
          Financial overview and analytics
        </div>
      </div>

      <div style={styles.scrollableContent} className="bills-scroll">
        <div style={styles.statsGrid} className="bills-stats-grid">
          <div style={styles.statCard} className="bills-stat-card">
            <DollarSign style={styles.statIcon} className="bills-stat-icon" />
            <div style={styles.statLabel} className="bills-stat-label">Total Sales</div>
            <div style={styles.statValue} className="bills-stat-value">
              {SETTINGS.currency}
              {stats.totalSales.toFixed(2)}
            </div>
          </div>

          <div style={styles.statCard} className="bills-stat-card">
            <ShoppingCart style={styles.statIcon} className="bills-stat-icon" />
            <div style={styles.statLabel} className="bills-stat-label">Total Orders</div>
            <div style={styles.statValue} className="bills-stat-value">{stats.totalOrders}</div>
          </div>

          <div style={styles.statCard} className="bills-stat-card">
            <TrendingUp style={styles.statIcon} className="bills-stat-icon" />
            <div style={styles.statLabel} className="bills-stat-label">Avg Order Value</div>
            <div style={styles.statValue} className="bills-stat-value">
              {SETTINGS.currency}
              {stats.avgOrderValue.toFixed(2)}
            </div>
          </div>
        </div>

        <div style={styles.content} className="bills-content">
          <FileText style={styles.icon} className="bills-icon" />
          <div style={styles.message} className="bills-message">Advanced Reports Coming Soon</div>
          <div style={styles.description} className="bills-description">
            The next version will include comprehensive reporting features to help you
            analyze your business performance and make data-driven decisions.
          </div>

          <div style={styles.featureList} className="bills-feature-list">
            {[
              "Daily, Weekly, and Monthly Sales Reports",
              "Product Performance Analytics",
              "Peak Hours and Trends Analysis",
              "Export to Excel, PDF, and CSV",
              "Tax Reports and Financial Summaries",
              "Custom Date Range Reports",
            ].map((feature, idx) => (
              <div key={idx} style={styles.featureItem} className="bills-feature-item">
                <svg
                  style={styles.checkIcon}
                  className="bills-check-icon"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillsPage;
