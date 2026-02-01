import { useState, useEffect, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Printer,
  Search,
  Filter
} from "lucide-react";
import { SETTINGS } from "../../data/menuData";

const OrdersPage = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const currentOrders = useMemo(() => {
    try {
      const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
      const today = new Date().toDateString();
      
      return transactions.filter(t => {
        const orderDate = new Date(t.timestamp).toDateString();
        return orderDate === today;
      }).reverse();
    } catch {
      return [];
    }
  }, [refreshKey]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    let filtered = currentOrders;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => {
        return (
          order.id.toLowerCase().includes(query) ||
          order.items.some(item => item.name.toLowerCase().includes(query))
        );
      });
    }

    // Status filter (all orders are completed in current system)
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    return filtered;
  }, [currentOrders, searchQuery, statusFilter]);

  // Calculate today's stats
  const todayStats = useMemo(() => {
    const totalRevenue = currentOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = currentOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue
    };
  }, [currentOrders]);

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
      marginBottom: "24px",
      flexShrink: 0,
    },
    scrollableContent: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: "0 40px 120px 40px",
      scrollbarWidth: "thin",
      scrollbarColor: `${theme.border} transparent`,
    },
    titleRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
      gap: "16px",
      flexWrap: "wrap",
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
    refreshBadge: {
      padding: "8px 16px",
      borderRadius: "8px",
      background: `${theme.success}20`,
      border: `1px solid ${theme.success}`,
      color: theme.success,
      fontSize: "12px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "12px",
      marginBottom: "20px",
    },
    statCard: {
      background: theme.cardBg,
      border: `1px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "16px",
      boxShadow: theme.shadow,
    },
    statLabel: {
      fontSize: "12px",
      color: theme.textSecondary,
      fontWeight: "600",
      marginBottom: "8px",
    },
    statValue: {
      fontSize: "24px",
      fontWeight: "900",
      color: theme.success,
    },
    searchBar: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      background: theme.bgSecondary,
      border: `1px solid ${theme.border}`,
      borderRadius: "10px",
      padding: "10px 14px",
      marginBottom: "16px",
    },
    searchInput: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      color: theme.textPrimary,
      fontSize: "14px",
      fontWeight: "500",
    },
    filters: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      alignItems: "center",
      marginBottom: "16px",
    },
    chip: (active) => ({
      padding: "8px 12px",
      borderRadius: "10px",
      border: `1px solid ${active ? theme.success : theme.border}`,
      background: active ? `${theme.success}15` : theme.bgSecondary,
      color: active ? theme.textPrimary : theme.textSecondary,
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "700",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      userSelect: "none",
      transition: "all 0.2s ease",
    }),
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
      position: "relative",
    },
    orderHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
      paddingBottom: "12px",
      borderBottom: `1px solid ${theme.border}`,
      gap: "12px",
      flexWrap: "wrap",
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
      gap: "12px",
    },
    orderFooter: {
      paddingTop: "12px",
      borderTop: `1px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "10px",
    },
    orderTotal: {
      fontSize: "18px",
      fontWeight: "700",
      color: theme.success,
    },
    orderActions: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
    },
    printBtn: {
      padding: "6px 12px",
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
      background: theme.bgSecondary,
      color: theme.textPrimary,
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s ease",
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

  const formatFullDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Print receipt
  const printReceipt = (order) => {
    const printWindow = window.open("", "_blank");
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${order.id}</title>
          <style>
            body { font-family: monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
            h2 { text-align: center; margin-bottom: 10px; }
            .line { border-bottom: 1px dashed #000; margin: 10px 0; }
            .row { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { font-weight: bold; font-size: 18px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <h2>${SETTINGS.shopName}</h2>
          <p style="text-align: center; margin: 0;">${SETTINGS.shopSubtitle}</p>
          <div class="line"></div>
          <p><strong>Order:</strong> ${order.id}</p>
          <p><strong>Date:</strong> ${formatFullDateTime(order.timestamp)}</p>
          <div class="line"></div>
          ${order.items.map(item => `
            <div class="row">
              <span>${item.name}${item.size ? ` (${item.size})` : ""} x${item.quantity}</span>
              <span>${SETTINGS.currency}${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="line"></div>
          <div class="row total">
            <span>TOTAL</span>
            <span>${SETTINGS.currency}${order.total.toFixed(2)}</span>
          </div>
          <p style="text-align: center; margin-top: 20px;"><strong>Payment:</strong> ${order.paymentMethod}</p>
          <p style="text-align: center; margin-top: 20px;">${SETTINGS.receiptFooter}</p>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  if (filteredOrders.length === 0 && searchQuery === "" && statusFilter === "all") {
    return (
      <div style={styles.container} className="orders-container">
        <style>{`
          .orders-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .orders-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .orders-scroll::-webkit-scrollbar-thumb {
            background: ${theme.border};
            border-radius: 4px;
          }
          .orders-scroll::-webkit-scrollbar-thumb:hover {
            background: ${theme.textLight};
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
          <div style={styles.subtitle} className="orders-subtitle">Today's orders • Real-time tracking</div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px' }}>
          <div style={styles.emptyState} className="orders-empty">
            <ShoppingCart style={styles.emptyIcon} className="orders-empty-icon" />
            <div style={styles.emptyMessage} className="orders-empty-text">No Orders Today</div>
            <div style={styles.emptyDescription} className="orders-empty-desc">
              Today's orders will appear here. Start taking orders from the Home page
              to see them listed here for tracking and management.
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
          width: 8px;
        }
        .orders-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .orders-scroll::-webkit-scrollbar-thumb {
          background: ${theme.border};
          border-radius: 4px;
        }
        .orders-scroll::-webkit-scrollbar-thumb:hover {
          background: ${theme.textLight};
        }

        /* Tablet: 768px - 1024px */
        @media (max-width: 1024px) and (min-width: 768px) {
          .orders-header {
            padding: 32px 32px 0 32px !important;
            margin-bottom: 22px !important;
          }
          .orders-title {
            font-size: 28px !important;
          }
          .orders-subtitle {
            font-size: 15px !important;
          }
          .orders-scroll {
            padding: 0 32px 180px 32px !important;
          }
          .orders-stats {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) !important;
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
            margin-bottom: 20px !important;
          }
          .orders-title {
            font-size: 24px !important;
          }
          .orders-subtitle {
            font-size: 14px !important;
          }
          .orders-scroll {
            padding: 0 20px 160px 20px !important;
          }
          .orders-stats {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .orders-stat-value {
            font-size: 20px !important;
          }
          .orders-search {
            padding: 8px 12px !important;
          }
          .orders-filters {
            gap: 8px !important;
          }
          .orders-chip {
            padding: 7px 10px !important;
            font-size: 12px !important;
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
        }

        /* Small Mobile: < 480px */
        @media (max-width: 480px) {
          .orders-header {
            padding: 20px 16px 0 16px !important;
            margin-bottom: 18px !important;
          }
          .orders-title {
            font-size: 22px !important;
          }
          .orders-subtitle {
            font-size: 13px !important;
          }
          .orders-scroll {
            padding: 0 16px 140px 16px !important;
          }
          .orders-stats {
            grid-template-columns: 1fr !important;
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
        }
      `}</style>
      <div style={styles.header} className="orders-header">
        <div style={styles.titleRow}>
          <div>
            <div style={styles.title} className="orders-title">Current Orders</div>
            <div style={styles.subtitle} className="orders-subtitle">
              {currentOrders.length} order{currentOrders.length !== 1 ? "s" : ""} today • Auto-refresh
            </div>
          </div>

          <div style={styles.refreshBadge}>
            <CheckCircle size={14} />
            Live
          </div>
        </div>

        {/* Today's Stats */}
        <div style={styles.statsGrid} className="orders-stats">
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Today's Revenue</div>
            <div style={styles.statValue} className="orders-stat-value">
              {SETTINGS.currency}{todayStats.totalRevenue.toFixed(2)}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Orders</div>
            <div style={styles.statValue} className="orders-stat-value">
              {todayStats.totalOrders}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Avg Order Value</div>
            <div style={styles.statValue} className="orders-stat-value">
              {SETTINGS.currency}{todayStats.avgOrderValue.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={styles.searchBar} className="orders-search">
          <Search size={16} color={theme.textSecondary} />
          <input
            type="text"
            placeholder="Search by order ID or item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Filters */}
        <div style={styles.filters} className="orders-filters">
          <div style={styles.chip(statusFilter === "all")} className="orders-chip" onClick={() => setStatusFilter("all")}>
            <Filter size={14} />
            All Orders
          </div>
          <div style={styles.chip(statusFilter === "completed")} className="orders-chip" onClick={() => setStatusFilter("completed")}>
            <CheckCircle size={14} />
            Completed
          </div>
        </div>
      </div>

      <div style={styles.scrollableContent} className="orders-scroll">
        {filteredOrders.length === 0 ? (
          <div style={styles.emptyState} className="orders-empty">
            <AlertCircle style={styles.emptyIcon} className="orders-empty-icon" />
            <div style={styles.emptyMessage} className="orders-empty-text">No orders found</div>
            <div style={styles.emptyDescription} className="orders-empty-desc">
              Try adjusting your search or filter criteria.
            </div>
          </div>
        ) : (
          <div style={styles.ordersGrid} className="orders-grid">
            {filteredOrders.map((order) => (
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
                  {order.items.slice(0, 5).map((item, idx) => (
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
                  {order.items.length > 5 && (
                    <div style={{ ...styles.orderItem, fontStyle: "italic" }} className="orders-item">
                      +{order.items.length - 5} more item{order.items.length - 5 !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                <div style={styles.orderFooter} className="orders-footer">
                  <div style={styles.orderTotal} className="orders-total">
                    {SETTINGS.currency}
                    {order.total.toFixed(2)}
                  </div>
                  
                  <div style={styles.orderActions}>
                    <button
                      style={styles.printBtn}
                      onClick={() => printReceipt(order)}
                      onMouseEnter={(e) => e.currentTarget.style.background = theme.bgHover}
                      onMouseLeave={(e) => e.currentTarget.style.background = theme.bgSecondary}
                    >
                      <Printer size={12} />
                      Print
                    </button>
                    
                    <div style={styles.statusBadge} className="orders-badge">
                      <CheckCircle size={14} />
                      Completed
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;