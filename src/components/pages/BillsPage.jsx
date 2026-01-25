import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { SETTINGS } from "../../data/menuData";
import { DollarSign, ShoppingCart, TrendingUp, FileText } from "lucide-react";

const BillsPage = () => {
  const { theme } = useTheme();

  const [stats] = useState(() => {
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

    const totalSales = transactions.reduce((sum, t) => {
      const subtotal = t.items.reduce(
        (s, item) => s + item.price * item.quantity,
        0
      );
      const tax = subtotal * SETTINGS.taxRate;
      const discount = t.discount ? (subtotal * t.discount) / 100 : 0;
      return sum + (subtotal + tax - discount);
    }, 0);

    const totalOrders = transactions.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    return { totalSales, totalOrders, avgOrderValue };
  });

  const styles = {
    container: {
      height: "100vh",
      overflow: "hidden",
      background: theme.bgPrimary,
      display: "flex",
      flexDirection: "column",
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
      padding: "0 40px 80px 40px",
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
    <div style={styles.container}>
      <style>{`
        .bills-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div style={styles.header}>
        <div style={styles.title}>Bills & Reports</div>
        <div style={styles.subtitle}>Financial overview and analytics</div>
      </div>

      <div style={styles.scrollableContent} className="bills-scroll">
        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <DollarSign style={styles.statIcon} />
            <div style={styles.statLabel}>Total Sales</div>
            <div style={styles.statValue}>
              {SETTINGS.currency}
              {stats.totalSales.toFixed(2)}
            </div>
          </div>

          <div style={styles.statCard}>
            <ShoppingCart style={styles.statIcon} />
            <div style={styles.statLabel}>Total Orders</div>
            <div style={styles.statValue}>{stats.totalOrders}</div>
          </div>

          <div style={styles.statCard}>
            <TrendingUp style={styles.statIcon} />
            <div style={styles.statLabel}>Avg Order Value</div>
            <div style={styles.statValue}>
              {SETTINGS.currency}
              {stats.avgOrderValue.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Detailed Reports Section */}
        <div style={styles.content}>
          <FileText style={styles.icon} />
          <div style={styles.message}>Advanced Reports Coming Soon</div>
          <div style={styles.description}>
            The next version will include comprehensive reporting features to help you
            analyze your business performance and make data-driven decisions.
          </div>

          <div style={styles.featureList}>
            <div style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Daily, Weekly, and Monthly Sales Reports</span>
            </div>

            <div style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Product Performance Analytics</span>
            </div>

            <div style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Peak Hours and Trends Analysis</span>
            </div>

            <div style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Export to Excel, PDF, and CSV</span>
            </div>

            <div style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Tax Reports and Financial Summaries</span>
            </div>

            <div style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Custom Date Range Reports</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillsPage;