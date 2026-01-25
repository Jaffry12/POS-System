import { useMemo, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { SETTINGS } from "../../data/menuData";
import { FiClock, FiCreditCard, FiFileText, FiCalendar } from "react-icons/fi";

const DAY_MS = 24 * 60 * 60 * 1000;

const HistoryPage = () => {
  const { theme } = useTheme();

  const [dateKeys] = useState(() => {
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);
    const yesterday = new Date(today.getTime() - DAY_MS);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);
    return { todayKey, yesterdayKey };
  });

  const [filterMode, setFilterMode] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });

  const transactions = useMemo(() => {
    const stored = JSON.parse(localStorage.getItem("transactions") || "[]");
    return Array.isArray(stored) ? stored.slice().reverse() : [];
  }, []);

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
      padding: "0 40px 80px 40px",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    header: {
      padding: "40px 40px 0 40px",
      marginBottom: "18px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: "16px",
      flexWrap: "wrap",
      flexShrink: 0,
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
    filters: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      alignItems: "center",
      background: theme.cardBg,
      border: `1px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "10px",
      boxShadow: theme.shadow,
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
    }),
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
    const subtotal = transaction.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * SETTINGS.taxRate;
    const discount = transaction.discount ? (subtotal * transaction.discount) / 100 : 0;
    return subtotal + tax - discount;
  };

  const grouped = useMemo(() => {
    let filtered = transactions;

    if (filterMode === "today") {
      filtered = transactions.filter((t) => getDayKey(t.timestamp) === dateKeys.todayKey);
    } else if (filterMode === "yesterday") {
      filtered = transactions.filter(
        (t) => getDayKey(t.timestamp) === dateKeys.yesterdayKey
      );
    } else if (filterMode === "date") {
      filtered = transactions.filter((t) => getDayKey(t.timestamp) === selectedDate);
    }

    const map = {};
    filtered.forEach((t) => {
      const key = getDayKey(t.timestamp);
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });

    const dayKeys = Object.keys(map).sort((a, b) => (a < b ? 1 : -1));

    return dayKeys.map((dayKey) => {
      const list = map[dayKey] || [];
      const daySales = list.reduce((sum, tx) => sum + calculateTotal(tx), 0);
      return { dayKey, list, daySales };
    });
  }, [transactions, filterMode, selectedDate, dateKeys.todayKey, dateKeys.yesterdayKey]);

  const getDayTitle = (dayKey) => {
    if (dayKey === dateKeys.todayKey) return "Today";
    if (dayKey === dateKeys.yesterdayKey) return "Yesterday";

    const [y, m, d] = dayKey.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (transactions.length === 0) {
    return (
      <div style={styles.container} className="history-container">
        <div style={styles.header} className="history-header">
          <div>
            <div style={styles.title} className="history-title">Order History</div>
            <div style={styles.subtitle} className="history-subtitle">View past transactions</div>
          </div>
        </div>

        <div style={styles.emptyState} className="history-empty">
          <FiFileText style={styles.emptyIcon} className="history-empty-icon" />
          <div style={styles.emptyText} className="history-empty-text">No order history yet</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .history-scroll::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }

        /* Tablet: 768px - 1024px */
        @media (max-width: 1024px) and (min-width: 768px) {
          .history-header {
            padding: 32px 32px 0 32px !important;
            margin-bottom: 16px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .history-title {
            font-size: 28px !important;
          }
          .history-subtitle {
            font-size: 13px !important;
          }
          .history-scroll {
            padding: 0 32px 60px 32px !important;
          }
          .history-filters {
            width: 100% !important;
          }
          .history-day-header {
            padding: 12px 14px !important;
          }
          .history-card {
            padding: 14px !important;
          }
        }

        /* Mobile: 480px - 768px */
        @media (max-width: 768px) {
          .history-header {
            padding: 24px 20px 0 20px !important;
            margin-bottom: 14px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .history-title {
            font-size: 24px !important;
            margin-bottom: 4px !important;
          }
          .history-subtitle {
            font-size: 13px !important;
          }
          .history-scroll {
            padding: 0 20px 60px 20px !important;
          }
          .history-filters {
            width: 100% !important;
            flex-direction: column !important;
            gap: 8px !important;
            padding: 8px !important;
          }
          .history-chip {
            width: 100% !important;
            justify-content: center !important;
            padding: 10px !important;
          }
          .history-date-wrap {
            width: 100% !important;
            padding: 10px !important;
          }
          .history-day-section {
            margin-top: 16px !important;
          }
          .history-day-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 12px !important;
            gap: 10px !important;
          }
          .history-day-title {
            font-size: 15px !important;
          }
          .history-card {
            padding: 14px !important;
          }
          .history-card-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
          .history-order-id {
            font-size: 15px !important;
          }
          .history-timestamp {
            font-size: 12px !important;
          }
          .history-item {
            font-size: 12px !important;
          }
          .history-footer {
            gap: 8px !important;
          }
          .history-total {
            font-size: 15px !important;
          }
          .history-empty {
            padding: 40px 20px !important;
            margin-top: 16px !important;
          }
          .history-empty-icon {
            font-size: 56px !important;
          }
          .history-empty-text {
            font-size: 16px !important;
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
          .history-subtitle {
            font-size: 12px !important;
          }
          .history-scroll {
            padding: 0 16px 60px 16px !important;
          }
          .history-filters {
            padding: 6px !important;
            gap: 6px !important;
          }
          .history-chip {
            padding: 8px !important;
            font-size: 12px !important;
          }
          .history-date-wrap {
            padding: 8px !important;
          }
          .history-day-section {
            margin-top: 14px !important;
          }
          .history-day-header {
            padding: 10px !important;
            border-radius: 12px !important;
          }
          .history-day-title {
            font-size: 14px !important;
            gap: 8px !important;
          }
          .history-day-meta {
            gap: 8px !important;
          }
          .history-pill {
            font-size: 11px !important;
            padding: 5px 8px !important;
          }
          .history-card {
            padding: 12px !important;
            border-radius: 10px !important;
          }
          .history-card-header {
            margin-bottom: 8px !important;
            padding-bottom: 8px !important;
          }
          .history-order-id {
            font-size: 14px !important;
          }
          .history-timestamp {
            font-size: 11px !important;
            gap: 6px !important;
          }
          .history-items {
            margin-bottom: 8px !important;
          }
          .history-item {
            font-size: 11px !important;
            padding: 5px 0 !important;
            gap: 8px !important;
          }
          .history-footer {
            padding-top: 8px !important;
            gap: 6px !important;
          }
          .history-payment {
            font-size: 11px !important;
            gap: 6px !important;
          }
          .history-total {
            font-size: 14px !important;
          }
          .history-empty {
            padding: 32px 16px !important;
            margin-top: 12px !important;
          }
          .history-empty-icon {
            font-size: 48px !important;
            margin-bottom: 16px !important;
          }
          .history-empty-text {
            font-size: 15px !important;
          }
        }
      `}</style>
      <div style={styles.container} className="history-container">
        <div style={styles.header} className="history-header">
          <div>
            <div style={styles.title} className="history-title">Order History</div>
            <div style={styles.subtitle} className="history-subtitle">
              {transactions.length} total transactions • grouped by day
            </div>
          </div>

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
          </div>
        </div>

        <div className={grouped.length > 0 ? "history-scroll" : ""} style={grouped.length > 0 ? styles.scrollableContent : {flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px'}}>
          {grouped.length === 0 ? (
            <div style={styles.emptyState} className="history-empty">
              <FiFileText style={styles.emptyIcon} className="history-empty-icon" />
              <div style={styles.emptyText} className="history-empty-text">No orders found for this filter</div>
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
                <div key={transaction.id} style={styles.transactionCard} className="history-card">
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