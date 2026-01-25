import { useTheme } from "../../context/ThemeContext";
import { ShoppingCart, Clock, CheckCircle } from "lucide-react";
import { SETTINGS } from "../../data/menuData";

const OrdersPage = () => {
  const { theme } = useTheme();

  // Get today's transactions to show as "current orders"
  const currentOrders = (() => {
    try {
      const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
      const today = new Date().toDateString();
      
      // Filter today's orders
      return transactions.filter(t => {
        const orderDate = new Date(t.timestamp).toDateString();
        return orderDate === today;
      }).slice(-10).reverse(); // Last 10 orders, newest first
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

    // Orders Grid
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

    // Empty State
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
      <div style={styles.container}>
        <style>{`
          .orders-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div style={styles.header}>
          <div style={styles.title}>Current Orders</div>
          <div style={styles.subtitle}>View and manage today's orders</div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px' }}>
          <div style={styles.emptyState}>
            <ShoppingCart style={styles.emptyIcon} />
            <div style={styles.emptyMessage}>No Orders Today</div>
            <div style={styles.emptyDescription}>
              Today's orders will appear here. Start taking orders from the Home page
              to see them listed here for kitchen management and tracking.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        .orders-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div style={styles.header}>
        <div style={styles.title}>Current Orders</div>
        <div style={styles.subtitle}>
          {currentOrders.length} order{currentOrders.length !== 1 ? "s" : ""} today
        </div>
      </div>

      <div style={styles.scrollableContent} className="orders-scroll">
        <div style={styles.ordersGrid}>
        {currentOrders.map((order) => (
          <div
            key={order.id}
            style={styles.orderCard}
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
            <div style={styles.orderHeader}>
              <div style={styles.orderId}>{order.id}</div>
              <div style={styles.orderTime}>
                <Clock size={14} />
                {formatTime(order.timestamp)}
              </div>
            </div>

            <div style={styles.orderItems}>
              {order.items.slice(0, 3).map((item, idx) => (
                <div key={idx} style={styles.orderItem}>
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
                <div style={{ ...styles.orderItem, fontStyle: "italic" }}>
                  +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? "s" : ""}
                </div>
              )}
            </div>

            <div style={styles.orderFooter}>
              <div style={styles.orderTotal}>
                {SETTINGS.currency}
                {order.total.toFixed(2)}
              </div>
              <div style={styles.statusBadge}>
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