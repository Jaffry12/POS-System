import { useTheme } from "../../context/ThemeContext";
import { ShoppingCart, Clock, CheckCircle } from "lucide-react";
import { SETTINGS } from "../../data/menuData";

const OrdersPage = () => {
  const { theme } = useTheme();

  const currentOrders = (() => {
    try {
      const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
      const today = new Date().toDateString();
      
      return transactions.filter(t => {
        const orderDate = new Date(t.timestamp).toDateString();
        return orderDate === today;
      }).slice(-10).reverse();
    } catch {
      return [];
    }
  })();

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
    ordersGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "20px",
    },
    orderCard: {
      background: theme.cardBg,
      borderRadius: "16px",
      padding: "20px",
      boxShadow: theme.shadow,
      border: `2px solid ${theme.border}`,
      transition: "all 0.2s ease",
    },
    orderHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
      paddingBottom: "12px",
      borderBottom: `1px solid ${theme.border}`,
    },
    orderId: {
      fontSize: "18px",
      fontWeight: "700",
      color: theme.textPrimary,
    },
    orderTime: {
      fontSize: "13px",
      color: theme.textSecondary,
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    orderItems: {
      marginBottom: "16px",
    },
    orderItem: {
      padding: "8px 0",
      fontSize: "14px",
      color: theme.textSecondary,
      display: "flex",
      justifyContent: "space-between",
    },
    orderFooter: {
      paddingTop: "12px",
      borderTop: `1px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    orderTotal: {
      fontSize: "18px",
      fontWeight: "700",
      color: theme.success,
    },
    statusBadge: {
      padding: "6px 12px",
      borderRadius: "8px",
      background: `${theme.success}20`,
      color: theme.success,
      fontSize: "12px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    emptyState: {
      background: theme.cardBg,
      borderRadius: "16px",
      padding: "60px 40px",
      textAlign: "center",
      boxShadow: theme.shadow,
    },
    emptyIcon: {
      width: "64px",
      height: "64px",
      margin: "0 auto 20px",
      color: theme.success,
    },
    emptyMessage: {
      fontSize: "18px",
      color: theme.textSecondary,
      marginBottom: "12px",
      fontWeight: "600",
    },
    emptyDescription: {
      fontSize: "14px",
      color: theme.textLight,
      maxWidth: "500px",
      margin: "0 auto",
    },
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (currentOrders.length === 0) {
    return (
      <div style={styles.container} className="orders-container">
        <style>{`
          .orders-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div style={styles.header} className="orders-header">
          <div style={styles.title} className="orders-title">Current Orders</div>
          <div style={styles.subtitle} className="orders-subtitle">View and manage today's orders</div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px' }}>
          <div style={styles.emptyState} className="orders-empty">
            <ShoppingCart style={styles.emptyIcon} className="orders-empty-icon" />
            <div style={styles.emptyMessage} className="orders-empty-text">No Orders Today</div>
            <div style={styles.emptyDescription} className="orders-empty-desc">
              Today's orders will appear here. Start taking orders from the Home page
              to see them listed here for kitchen management and tracking.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container} className="orders-container">
      <style>{`
        .orders-scroll::-webkit-scrollbar {
          display: none;
        }

        /* Tablet: 768px - 1024px */
        @media (max-width: 1024px) and (min-width: 768px) {
          .orders-header {
            padding: 32px 32px 0 32px !important;
            margin-bottom: 28px !important;
          }
          .orders-title {
            font-size: 28px !important;
          }
          .orders-subtitle {
            font-size: 15px !important;
          }
          .orders-scroll {
            padding: 0 32px 60px 32px !important;
          }
          .orders-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
            gap: 18px !important;
          }
          .orders-card {
            padding: 18px !important;
          }
        }

        /* Mobile: 480px - 768px */
        @media (max-width: 768px) {
          .orders-header {
            padding: 24px 20px 0 20px !important;
            margin-bottom: 24px !important;
          }
          .orders-title {
            font-size: 24px !important;
          }
          .orders-subtitle {
            font-size: 14px !important;
          }
          .orders-scroll {
            padding: 0 20px 60px 20px !important;
          }
          .orders-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .orders-card {
            padding: 16px !important;
          }
          .orders-card-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
            margin-bottom: 14px !important;
            padding-bottom: 10px !important;
          }
          .orders-id {
            font-size: 16px !important;
          }
          .orders-time {
            font-size: 12px !important;
          }
          .orders-items {
            margin-bottom: 14px !important;
          }
          .orders-item {
            font-size: 13px !important;
            padding: 6px 0 !important;
          }
          .orders-footer {
            padding-top: 10px !important;
          }
          .orders-total {
            font-size: 16px !important;
          }
          .orders-badge {
            font-size: 11px !important;
            padding: 5px 10px !important;
          }
          .orders-empty {
            padding: 40px 20px !important;
            margin: 0 20px !important;
          }
          .orders-empty-icon {
            width: 56px !important;
            height: 56px !important;
          }
          .orders-empty-text {
            font-size: 16px !important;
          }
          .orders-empty-desc {
            font-size: 13px !important;
          }
        }

        /* Small Mobile: < 480px */
        @media (max-width: 480px) {
          .orders-header {
            padding: 20px 16px 0 16px !important;
            margin-bottom: 20px !important;
          }
          .orders-title {
            font-size: 22px !important;
          }
          .orders-subtitle {
            font-size: 13px !important;
          }
          .orders-scroll {
            padding: 0 16px 60px 16px !important;
          }
          .orders-grid {
            gap: 14px !important;
          }
          .orders-card {
            padding: 14px !important;
            border-radius: 12px !important;
          }
          .orders-card-header {
            margin-bottom: 12px !important;
            padding-bottom: 8px !important;
          }
          .orders-id {
            font-size: 15px !important;
          }
          .orders-time {
            font-size: 11px !important;
            gap: 4px !important;
          }
          .orders-items {
            margin-bottom: 12px !important;
          }
          .orders-item {
            font-size: 12px !important;
            padding: 5px 0 !important;
          }
          .orders-footer {
            padding-top: 8px !important;
            gap: 8px !important;
            flex-wrap: wrap !important;
          }
          .orders-total {
            font-size: 15px !important;
          }
          .orders-badge {
            font-size: 10px !important;
            padding: 4px 8px !important;
          }
          .orders-empty {
            padding: 32px 16px !important;
            margin: 0 !important;
          }
          .orders-empty-icon {
            width: 48px !important;
            height: 48px !important;
            margin-bottom: 16px !important;
          }
          .orders-empty-text {
            font-size: 15px !important;
            margin-bottom: 10px !important;
          }
          .orders-empty-desc {
            font-size: 12px !important;
          }
        }
      `}</style>
      <div style={styles.header} className="orders-header">
        <div style={styles.title} className="orders-title">Current Orders</div>
        <div style={styles.subtitle} className="orders-subtitle">
          {currentOrders.length} order{currentOrders.length !== 1 ? "s" : ""} today
        </div>
      </div>

      <div style={styles.scrollableContent} className="orders-scroll">
        <div style={styles.ordersGrid} className="orders-grid">
        {currentOrders.map((order) => (
          <div
            key={order.id}
            style={styles.orderCard}
            className="orders-card"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.success;
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = theme.shadowMedium;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = theme.shadow;
            }}
          >
            <div style={styles.orderHeader} className="orders-card-header">
              <div style={styles.orderId} className="orders-id">{order.id}</div>
              <div style={styles.orderTime} className="orders-time">
                <Clock size={14} />
                {formatTime(order.timestamp)}
              </div>
            </div>

            <div style={styles.orderItems} className="orders-items">
              {order.items.slice(0, 3).map((item, idx) => (
                <div key={idx} style={styles.orderItem} className="orders-item">
                  <span>
                    {item.name} {item.size ? `(${item.size})` : ""} x{item.quantity}
                  </span>
                  <span>
                    {SETTINGS.currency}
                    {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              {order.items.length > 3 && (
                <div style={{ ...styles.orderItem, fontStyle: "italic" }} className="orders-item">
                  +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? "s" : ""}
                </div>
              )}
            </div>

            <div style={styles.orderFooter} className="orders-footer">
              <div style={styles.orderTotal} className="orders-total">
                {SETTINGS.currency}
                {order.total.toFixed(2)}
              </div>
              <div style={styles.statusBadge} className="orders-badge">
                <CheckCircle size={14} />
                Completed
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default OrdersPage;