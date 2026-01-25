// src/components/Reports/SalesStats.jsx
import { useEffect, useMemo, useState } from "react";
import { COLORS, RADIUS, SPACING, FONTS } from "../../theme/colors";
import { formatCurrency } from "../../utils/calculations";

const SalesStats = ({ transactions }) => {
  /* ------------------ Responsive logic ------------------ */
  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const device = useMemo(() => {
    if (vw <= 480) return "xs"; // small mobile
    if (vw <= 768) return "sm"; // mobile
    if (vw <= 1024) return "md"; // tablet
    return "lg"; // desktop
  }, [vw]);

  const ui = useMemo(() => {
    // Defaults (desktop)
    let gridCols = "repeat(3, 1fr)";
    let cardPad = SPACING.md;
    let valueSize = FONTS.xxlarge;
    let listMaxH = 320;
    let itemPad = SPACING.sm;

    if (device === "md") {
      gridCols = "repeat(3, 1fr)";
      cardPad = SPACING.md;
      valueSize = FONTS.xxlarge;
      listMaxH = 300;
      itemPad = SPACING.sm;
    }

    if (device === "sm") {
      gridCols = "repeat(2, 1fr)";
      cardPad = 14;
      valueSize = 26; // px
      listMaxH = 260;
      itemPad = 12;
    }

    if (device === "xs") {
      gridCols = "1fr";
      cardPad = 12;
      valueSize = 24; // px
      listMaxH = 240;
      itemPad = 10;
    }

    return { gridCols, cardPad, valueSize, listMaxH, itemPad };
  }, [device]);

  /* ------------------ Calculations ------------------ */
  const totalSales = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const totalTransactions = transactions.length;
  const avgTransaction =
    totalTransactions > 0 ? totalSales / totalTransactions : 0;

  /* ------------------ Styles ------------------ */
  const styles = {
    statsGrid: {
      display: "grid",
      gridTemplateColumns: ui.gridCols,
      gap: SPACING.sm,
      marginBottom: SPACING.md,
    },
    statCard: {
      background: COLORS.white,
      padding: ui.cardPad,
      borderRadius: RADIUS.small,
      border: `1px solid ${COLORS.gray200}`,
    },
    statLabel: {
      color: COLORS.textSecondary,
      fontSize: FONTS.small,
      marginBottom: SPACING.xs,
      fontWeight: 600,
    },
    statValue: {
      fontSize:
        typeof ui.valueSize === "number" ? `${ui.valueSize}px` : ui.valueSize,
      fontWeight: 800,
      color: COLORS.primary,
      lineHeight: 1.1,
      wordBreak: "break-word",
    },
    transactionList: {
      maxHeight: `${ui.listMaxH}px`,
      overflowY: "auto",
      marginTop: SPACING.md,
      paddingRight: 6, // small space for scrollbar
    },
    listTitle: {
      margin: "0 0 10px 0",
      fontSize: FONTS.medium,
      color: COLORS.textPrimary,
      fontWeight: 700,
    },
    transactionItem: {
      padding: ui.itemPad,
      background: COLORS.gray100,
      borderRadius: RADIUS.small,
      marginBottom: SPACING.xs,
      fontSize: FONTS.small,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      flexWrap: "wrap",
      border: `1px solid ${COLORS.gray200}`,
    },
    left: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
    },
    amount: {
      fontWeight: 800,
      color: COLORS.textPrimary,
    },
    meta: {
      color: COLORS.textSecondary,
      fontWeight: 600,
    },
    time: {
      color: COLORS.textSecondary,
      fontWeight: 600,
      marginLeft: "auto",
    },
  };

  const last10 = transactions.slice(-10).reverse();

  return (
    <div>
      {/* ✅ Responsive: 3 cards desktop, 2 cards mobile, 1 card small mobile */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Sales</div>
          <div style={styles.statValue}>{formatCurrency(totalSales)}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Transactions</div>
          <div style={styles.statValue}>{totalTransactions}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Average Transaction</div>
          <div style={styles.statValue}>{formatCurrency(avgTransaction)}</div>
        </div>
      </div>

      {transactions.length > 0 && (
        <div style={styles.transactionList} className="scrollbar-thin">
          <h4 style={styles.listTitle}>Recent Transactions</h4>

          {last10.map((t) => (
            <div key={t.id} style={styles.transactionItem}>
              <div style={styles.left}>
                <span style={styles.amount}>
                  {formatCurrency(t.total || 0)}
                </span>
                <span style={styles.meta}>
                  {t.paymentMethod || "N/A"}
                </span>
              </div>

              <span style={styles.time}>
                {t.timestamp ? new Date(t.timestamp).toLocaleTimeString() : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesStats;
