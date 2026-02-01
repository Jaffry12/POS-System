import { useMemo, useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { SETTINGS } from "../../data/menuData";
import { 
  FiClock, 
  FiCreditCard, 
  FiFileText, 
  FiCalendar, 
  FiSearch,
  FiDownload,
  FiPrinter,
  FiTrendingUp,
  FiDollarSign,
  FiShoppingBag
} from "react-icons/fi";

const DAY_MS = 24 * 60 * 60 * 1000;

const HistoryPage = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [dateKeys] = useState(() => {
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);
    const yesterday = new Date(today.getTime() - DAY_MS);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);
    return { todayKey, yesterdayKey };
  });

  // Check and perform weekly reset
  useEffect(() => {
    const checkWeeklyReset = () => {
      const lastReset = localStorage.getItem("lastHistoryReset");
      const now = new Date();
      
      // Check if it's Sunday (0) and past midnight
      if (now.getDay() === 0) {
        const todayKey = now.toISOString().slice(0, 10);
        
        // If we haven't reset today yet
        if (lastReset !== todayKey) {
          // Archive current week's data
          const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
          const archives = JSON.parse(localStorage.getItem("transactionArchives") || "[]");
          
          if (transactions.length > 0) {
            const weekData = {
              weekEnding: todayKey,
              transactions: transactions,
              totalOrders: transactions.length,
              totalRevenue: transactions.reduce((sum, t) => sum + (t.total || 0), 0),
              archivedAt: now.toISOString()
            };
            
            archives.push(weekData);
            localStorage.setItem("transactionArchives", JSON.stringify(archives));
          }
          
          // Reset current transactions
          localStorage.setItem("transactions", "[]");
          localStorage.setItem("lastHistoryReset", todayKey);
          
          console.log("Weekly history reset completed on Sunday");
        }
      }
    };

    // Check on mount
    checkWeeklyReset();
    
    // Check every hour
    const interval = setInterval(checkWeeklyReset, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const transactions = useMemo(() => {
    const stored = JSON.parse(localStorage.getItem("transactions") || "[]");
    return Array.isArray(stored) ? stored.slice().reverse() : [];
  }, []);

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
    const totalOrders = transactions.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Most popular items
    const itemCounts = {};
    transactions.forEach(t => {
      t.items.forEach(item => {
        const key = item.name;
        itemCounts[key] = (itemCounts[key] || 0) + item.quantity;
      });
    });
    
    const topItem = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0];
    
    // Payment method breakdown
    const paymentCounts = {};
    transactions.forEach(t => {
      const method = t.paymentMethod || "unknown";
      paymentCounts[method] = (paymentCounts[method] || 0) + 1;
    });

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      topItem: topItem ? { name: topItem[0], count: topItem[1] } : null,
      paymentCounts
    };
  }, [transactions]);

  const styles = {
    container: {
      height: "100vh",
      overflow: "hidden",
      background: theme.bgPrimary,
      display: "flex",
      flexDirection: "column",
    },
    scrollableContent: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: "0 40px 120px 40px",
      scrollbarWidth: "thin",
      scrollbarColor: `${theme.border} transparent`,
    },
    header: {
      padding: "40px 40px 0 40px",
      marginBottom: "18px",
      flexShrink: 0,
    },
    titleRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
      gap: "16px",
      flexWrap: "wrap",
    },
    title: {
      fontSize: "32px",
      fontWeight: "800",
      color: theme.textPrimary,
      marginBottom: "6px",
    },
    subtitle: {
      fontSize: "14px",
      color: theme.textSecondary,
    },
    resetBadge: {
      padding: "8px 16px",
      borderRadius: "8px",
      background: `${theme.warning}20`,
      border: `1px solid ${theme.warning}`,
      color: theme.warning,
      fontSize: "12px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    analyticsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "12px",
      marginBottom: "20px",
    },
    analyticCard: {
      background: theme.cardBg,
      border: `1px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "16px",
      boxShadow: theme.shadow,
    },
    analyticLabel: {
      fontSize: "12px",
      color: theme.textSecondary,
      fontWeight: "600",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    analyticValue: {
      fontSize: "24px",
      fontWeight: "900",
      color: theme.textPrimary,
    },
    analyticSubtext: {
      fontSize: "11px",
      color: theme.textLight,
      marginTop: "4px",
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
      border: `1px solid ${active ? theme.primary : theme.border}`,
      background: active ? `${theme.primary}15` : theme.bgSecondary,
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
    actionButtons: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    },
    actionBtn: {
      padding: "8px 16px",
      borderRadius: "10px",
      border: `1px solid ${theme.border}`,
      background: theme.bgSecondary,
      color: theme.textPrimary,
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.2s ease",
    },
    dateInputWrap: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      borderRadius: "10px",
      border: `1px solid ${theme.border}`,
      background: theme.bgSecondary,
    },
    dateInput: {
      border: "none",
      outline: "none",
      background: "transparent",
      color: theme.textPrimary,
      fontWeight: "700",
      fontSize: "13px",
    },
    daySection: { marginTop: "18px" },
    dayHeader: {
      background: theme.cardBg,
      border: `1px solid ${theme.border}`,
      borderRadius: "14px",
      padding: "14px 16px",
      boxShadow: theme.shadow,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
      marginBottom: "12px",
    },
    dayTitle: {
      fontSize: "16px",
      fontWeight: "900",
      color: theme.textPrimary,
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    dayMeta: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      alignItems: "center",
    },
    pill: {
      padding: "6px 10px",
      borderRadius: "999px",
      background: theme.bgSecondary,
      border: `1px solid ${theme.border}`,
      color: theme.textSecondary,
      fontSize: "12px",
      fontWeight: "800",
    },
    pillSuccess: {
      padding: "6px 10px",
      borderRadius: "999px",
      background: `${theme.success}15`,
      border: `1px solid ${theme.success}55`,
      color: theme.success,
      fontSize: "12px",
      fontWeight: "900",
    },
    transactionsList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    transactionCard: {
      background: theme.cardBg,
      borderRadius: "12px",
      padding: "16px",
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
      transition: "all 0.2s ease",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px",
      marginBottom: "10px",
      paddingBottom: "10px",
      borderBottom: `1px solid ${theme.border}`,
      flexWrap: "wrap",
    },
    orderId: {
      fontSize: "16px",
      fontWeight: "800",
      color: theme.textPrimary,
    },
    timestamp: {
      fontSize: "13px",
      color: theme.textSecondary,
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontWeight: "700",
    },
    items: { marginBottom: "10px" },
    item: {
      padding: "6px 0",
      fontSize: "13px",
      color: theme.textSecondary,
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: "10px",
      borderTop: `1px solid ${theme.border}`,
      flexWrap: "wrap",
      gap: "10px",
    },
    paymentMethod: {
      fontSize: "13px",
      color: theme.textSecondary,
      textTransform: "capitalize",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontWeight: "700",
    },
    total: {
      fontSize: "16px",
      fontWeight: "900",
      color: theme.success,
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
    emptyState: {
      background: theme.cardBg,
      borderRadius: "16px",
      padding: "60px 40px",
      textAlign: "center",
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
      marginTop: "20px",
    },
    emptyIcon: {
      fontSize: "64px",
      marginBottom: "20px",
      color: theme.primary,
    },
    emptyText: {
      fontSize: "18px",
      color: theme.textSecondary,
      fontWeight: "700",
    },
    inlineIcon: {
      fontSize: "16px",
      color: theme.textSecondary,
    },
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDayKey = (timestamp) => new Date(timestamp).toISOString().slice(0, 10);

  const calculateTotal = (transaction) => {
    const subtotal = transaction.items.reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0);
    const tax = subtotal * SETTINGS.taxRate;
    const discount = transaction.discount || 0;
    return subtotal + tax - discount;
  };

  const getDayTitle = (dayKey) => {
    if (dayKey === dateKeys.todayKey) return "Today";
    if (dayKey === dateKeys.yesterdayKey) return "Yesterday";
    return new Date(dayKey).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => {
        return (
          t.id.toLowerCase().includes(query) ||
          t.items.some(item => item.name.toLowerCase().includes(query)) ||
          t.paymentMethod.toLowerCase().includes(query)
        );
      });
    }

    // Payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(t => t.paymentMethod === paymentFilter);
    }

    // Date filter
    if (filterMode === "today") {
      filtered = filtered.filter((t) => getDayKey(t.timestamp) === dateKeys.todayKey);
    } else if (filterMode === "yesterday") {
      filtered = filtered.filter((t) => getDayKey(t.timestamp) === dateKeys.yesterdayKey);
    } else if (filterMode === "date") {
      filtered = filtered.filter((t) => getDayKey(t.timestamp) === selectedDate);
    }

    return filtered;
  }, [transactions, searchQuery, paymentFilter, filterMode, dateKeys, selectedDate]);

  // Group by day
  const grouped = useMemo(() => {
    const map = {};
    filteredTransactions.forEach((t) => {
      const key = getDayKey(t.timestamp);
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });

    return Object.entries(map)
      .map(([dayKey, list]) => {
        const daySales = list.reduce((sum, t) => sum + calculateTotal(t), 0);
        return { dayKey, list, daySales };
      })
      .sort((a, b) => b.dayKey.localeCompare(a.dayKey));
  }, [filteredTransactions]);

  // Print receipt function
  const printReceipt = (transaction) => {
    const printWindow = window.open("", "_blank");
    const total = calculateTotal(transaction);
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${transaction.id}</title>
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
          <p><strong>Order:</strong> ${transaction.id}</p>
          <p><strong>Date:</strong> ${formatDateTime(transaction.timestamp)}</p>
          <div class="line"></div>
          ${transaction.items.map(item => `
            <div class="row">
              <span>${item.name} x${item.quantity}</span>
              <span>${SETTINGS.currency}${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="line"></div>
          <div class="row total">
            <span>TOTAL</span>
            <span>${SETTINGS.currency}${total.toFixed(2)}</span>
          </div>
          <p style="text-align: center; margin-top: 20px;"><strong>Payment:</strong> ${transaction.paymentMethod}</p>
          <p style="text-align: center; margin-top: 20px;">${SETTINGS.receiptFooter}</p>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Order ID", "Date", "Time", "Items", "Payment", "Total"];
    const rows = filteredTransactions.map(t => {
      const date = new Date(t.timestamp);
      const itemsList = t.items.map(i => `${i.name} x${i.quantity}`).join("; ");
      return [
        t.id,
        date.toLocaleDateString("en-GB"),
        date.toLocaleTimeString("en-GB"),
        itemsList,
        t.paymentMethod,
        calculateTotal(t).toFixed(2)
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `history-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <>
      <style>
        {`
          .history-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .history-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .history-scroll::-webkit-scrollbar-thumb {
            background: ${theme.border};
            border-radius: 4px;
          }
          .history-scroll::-webkit-scrollbar-thumb:hover {
            background: ${theme.textLight};
          }

          /* Tablet: 768px - 1024px */
          @media (max-width: 1024px) and (min-width: 768px) {
            .history-header {
              padding: 32px 32px 0 32px !important;
              margin-bottom: 16px !important;
            }
            .history-title {
              font-size: 28px !important;
            }
            .history-scroll {
              padding: 0 32px 180px 32px !important;
            }
            .history-analytics {
              grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) !important;
            }
          }

          /* Mobile: 480px - 768px */
          @media (max-width: 768px) {
            .history-header {
              padding: 24px 20px 0 20px !important;
              margin-bottom: 14px !important;
            }
            .history-title {
              font-size: 24px !important;
            }
            .history-subtitle {
              font-size: 13px !important;
            }
            .history-scroll {
              padding: 0 20px 160px 20px !important;
            }
            .history-analytics {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 10px !important;
            }
            .history-analytic-value {
              font-size: 20px !important;
            }
            .history-search {
              padding: 8px 12px !important;
            }
            .history-filters {
              gap: 8px !important;
            }
            .history-chip {
              padding: 7px 10px !important;
              font-size: 12px !important;
            }
          }

          /* Small Mobile: < 480px */
          @media (max-width: 480px) {
            .history-header {
              padding: 20px 16px 0 16px !important;
              margin-bottom: 12px !important;
            }
            .history-title {
              font-size: 22px !important;
            }
            .history-scroll {
              padding: 0 16px 140px 16px !important;
            }
            .history-analytics {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
      <div style={styles.container} className="history-container">
        <div style={styles.header} className="history-header">
          <div style={styles.titleRow}>
            <div>
              <div style={styles.title} className="history-title">Order History</div>
              <div style={styles.subtitle} className="history-subtitle">
                {transactions.length} total transactions • Resets every Sunday
              </div>
            </div>
            
            <div style={styles.resetBadge}>
              <FiCalendar />
              Current Week
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div style={styles.analyticsGrid} className="history-analytics">
            <div style={styles.analyticCard}>
              <div style={styles.analyticLabel}>
                <FiDollarSign size={14} />
                Total Revenue
              </div>
              <div style={styles.analyticValue} className="history-analytic-value">
                {SETTINGS.currency}{analytics.totalRevenue.toFixed(2)}
              </div>
            </div>

            <div style={styles.analyticCard}>
              <div style={styles.analyticLabel}>
                <FiShoppingBag size={14} />
                Total Orders
              </div>
              <div style={styles.analyticValue} className="history-analytic-value">
                {analytics.totalOrders}
              </div>
            </div>

            <div style={styles.analyticCard}>
              <div style={styles.analyticLabel}>
                <FiTrendingUp size={14} />
                Avg Order Value
              </div>
              <div style={styles.analyticValue} className="history-analytic-value">
                {SETTINGS.currency}{analytics.avgOrderValue.toFixed(2)}
              </div>
            </div>

            <div style={styles.analyticCard}>
              <div style={styles.analyticLabel}>
                <FiShoppingBag size={14} />
                Top Item
              </div>
              <div style={styles.analyticValue} className="history-analytic-value">
                {analytics.topItem ? analytics.topItem.count : 0}
              </div>
              <div style={styles.analyticSubtext}>
                {analytics.topItem ? analytics.topItem.name : "No data"}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div style={styles.searchBar} className="history-search">
            <FiSearch color={theme.textSecondary} />
            <input
              type="text"
              placeholder="Search by order ID, item, or payment method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Filters */}
          <div style={styles.filters} className="history-filters">
            <div style={styles.chip(filterMode === "all")} className="history-chip" onClick={() => setFilterMode("all")}>
              All Days
            </div>
            <div
              style={styles.chip(filterMode === "today")}
              className="history-chip"
              onClick={() => setFilterMode("today")}
            >
              Today
            </div>
            <div
              style={styles.chip(filterMode === "yesterday")}
              className="history-chip"
              onClick={() => setFilterMode("yesterday")}
            >
              Yesterday
            </div>

            <div
              style={styles.chip(filterMode === "date")}
              className="history-chip"
              onClick={() => setFilterMode("date")}
            >
              <FiCalendar />
              Pick Date
            </div>

            {filterMode === "date" && (
              <div style={styles.dateInputWrap} className="history-date-wrap">
                <FiCalendar style={{ color: theme.textSecondary }} />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={styles.dateInput}
                />
              </div>
            )}

            <div style={styles.chip(paymentFilter === "all")} className="history-chip" onClick={() => setPaymentFilter("all")}>
              All Payments
            </div>
            <div style={styles.chip(paymentFilter === "cash")} className="history-chip" onClick={() => setPaymentFilter("cash")}>
              Cash
            </div>
            <div style={styles.chip(paymentFilter === "card")} className="history-chip" onClick={() => setPaymentFilter("card")}>
              Card
            </div>
            <div style={styles.chip(paymentFilter === "gift")} className="history-chip" onClick={() => setPaymentFilter("gift")}>
              Gift
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button
              style={styles.actionBtn}
              onClick={exportToCSV}
              onMouseEnter={(e) => e.currentTarget.style.background = theme.bgHover}
              onMouseLeave={(e) => e.currentTarget.style.background = theme.bgSecondary}
            >
              <FiDownload />
              Export CSV
            </button>
          </div>
        </div>

        <div className="history-scroll" style={styles.scrollableContent}>
          {grouped.length === 0 ? (
            <div style={styles.emptyState} className="history-empty">
              <FiFileText style={styles.emptyIcon} className="history-empty-icon" />
              <div style={styles.emptyText} className="history-empty-text">No orders found</div>
            </div>
          ) : (
            grouped.map((day) => (
          <div key={day.dayKey} style={styles.daySection} className="history-day-section">
            <div style={styles.dayHeader} className="history-day-header">
              <div style={styles.dayTitle} className="history-day-title">
                <FiCalendar style={{ color: theme.textSecondary }} />
                {getDayTitle(day.dayKey)}
              </div>

              <div style={styles.dayMeta} className="history-day-meta">
                <div style={styles.pill} className="history-pill">{day.list.length} orders</div>
                <div style={styles.pillSuccess} className="history-pill">
                  {SETTINGS.currency}
                  {day.daySales.toFixed(2)} sales
                </div>
              </div>
            </div>

            <div style={styles.transactionsList}>
              {day.list.map((transaction) => (
                <div 
                  key={transaction.id} 
                  style={styles.transactionCard} 
                  className="history-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = theme.shadowMedium;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = theme.shadow;
                  }}
                >
                  <div style={styles.cardHeader} className="history-card-header">
                    <div style={styles.orderId} className="history-order-id">{transaction.id}</div>

                    <div style={styles.timestamp} className="history-timestamp">
                      <FiClock style={styles.inlineIcon} />
                      {formatDateTime(transaction.timestamp)}
                    </div>
                  </div>

                  <div style={styles.items} className="history-items">
                    {transaction.items.map((item, idx) => (
                      <div key={idx} style={styles.item} className="history-item">
                        <span>
                          {item.name}
                          {item.size ? ` (${item.size})` : ""} x{item.quantity}
                        </span>
                        <span>
                          {SETTINGS.currency}
                          {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={styles.footer} className="history-footer">
                    <div style={styles.paymentMethod} className="history-payment">
                      <FiCreditCard style={styles.inlineIcon} />
                      {transaction.paymentMethod}
                    </div>

                    <button
                      style={styles.printBtn}
                      onClick={() => printReceipt(transaction)}
                      onMouseEnter={(e) => e.currentTarget.style.background = theme.bgHover}
                      onMouseLeave={(e) => e.currentTarget.style.background = theme.bgSecondary}
                    >
                      <FiPrinter size={12} />
                      Print
                    </button>

                    <div style={styles.total} className="history-total">
                      {SETTINGS.currency}
                      {calculateTotal(transaction).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
        </div>
      </div>
    </>
  );
};

export default HistoryPage;