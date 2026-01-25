import { useMemo, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { SETTINGS } from "../../data/menuData";
import { FiClock, FiCreditCard, FiFileText, FiCalendar } from "react-icons/fi";

const DAY_MS = 24 * 60 * 60 * 1000;

const HistoryPage = () => {
  const { theme } = useTheme();

  // âœ… stable date keys (computed once)
  const [dateKeys] = useState(() => {
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);

    const yesterday = new Date(today.getTime() - DAY_MS);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);

    return { todayKey, yesterdayKey };
  });

  const [filterMode, setFilterMode] = useState("all"); // all | today | yesterday | date
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

  // âœ… group only (no formatDayTitle call here)
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

  // âœ… title computed during render (no memo issues)
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
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>Order History</div>
            <div style={styles.subtitle}>View past transactions</div>
          </div>
        </div>

        <div style={styles.emptyState}>
          <FiFileText style={styles.emptyIcon} />
          <div style={styles.emptyText}>No order history yet</div>
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
      `}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>Order History</div>
            <div style={styles.subtitle}>
              {transactions.length} total transactions â€¢ grouped by day
            </div>
          </div>

          <div style={styles.filters}>
            <div style={styles.chip(filterMode === "all")} onClick={() => setFilterMode("all")}>
              All Days
            </div>
            <div
              style={styles.chip(filterMode === "today")}
              onClick={() => setFilterMode("today")}
            >
              Today
            </div>
            <div
              style={styles.chip(filterMode === "yesterday")}
              onClick={() => setFilterMode("yesterday")}
            >
              Yesterday
            </div>

            <div
              style={styles.chip(filterMode === "date")}
              onClick={() => setFilterMode("date")}
            >
              <FiCalendar />
              Pick Date
            </div>

            {filterMode === "date" && (
              <div style={styles.dateInputWrap}>
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

        <div className={grouped.length > 0 ? "history-scroll" : ""} style={grouped.length > 0 ? styles.scrollableContent : {flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {grouped.length === 0 ? (
            <div style={styles.emptyState}>
              <FiFileText style={styles.emptyIcon} />
              <div style={styles.emptyText}>No orders found for this filter</div>
            </div>
          ) : (
            grouped.map((day) => (
          <div key={day.dayKey} style={styles.daySection}>
            <div style={styles.dayHeader}>
              <div style={styles.dayTitle}>
                <FiCalendar style={{ color: theme.textSecondary }} />
                {getDayTitle(day.dayKey)}
              </div>

              <div style={styles.dayMeta}>
                <div style={styles.pill}>{day.list.length} orders</div>
                <div style={styles.pillSuccess}>
                  {SETTINGS.currency}
                  {day.daySales.toFixed(2)} sales
                </div>
              </div>
            </div>

            <div style={styles.transactionsList}>
              {day.list.map((transaction) => (
                <div key={transaction.id} style={styles.transactionCard}>
                  <div style={styles.cardHeader}>
                    <div style={styles.orderId}>{transaction.id}</div>

                    <div style={styles.timestamp}>
                      <FiClock style={styles.inlineIcon} />
                      {formatDateTime(transaction.timestamp)}
                    </div>
                  </div>

                  <div style={styles.items}>
                    {transaction.items.map((item, idx) => (
                      <div key={idx} style={styles.item}>
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

                  <div style={styles.footer}>
                    <div style={styles.paymentMethod}>
                      <FiCreditCard style={styles.inlineIcon} />
                      {transaction.paymentMethod}
                    </div>

                    <div style={styles.total}>
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