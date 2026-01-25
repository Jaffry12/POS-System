// src/components/Order/OrderSummary.jsx
import { useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import { SETTINGS } from "../../data/menuData";

const OrderSummary = () => {
  const { theme } = useTheme();
  const { currentOrder, discount, setDiscount } = usePOS();

  const totals = useMemo(() => {
    const subtotalCents = currentOrder.reduce((sum, item) => {
      const unit = Number(item?.price || 0);
      const qty = Number(item?.quantity || 0);
      return sum + unit * qty;
    }, 0);

    const subtotal = subtotalCents / 100;
    const taxAmount = subtotal * SETTINGS.taxRate;
    const safeDiscount = Number.isFinite(discount) ? Math.max(0, Math.min(100, discount)) : 0;
    const discountAmount = (subtotal * safeDiscount) / 100;
    const total = subtotal + taxAmount - discountAmount;

    return { subtotal, taxAmount, discountAmount, total, safeDiscount };
  }, [currentOrder, discount]);

  const handleDiscountChange = (value) => {
    const val = value === "" ? 0 : Number(value);
    const safe = Number.isFinite(val) ? Math.max(0, Math.min(100, val)) : 0;
    setDiscount(safe);
  };

  const incrementDiscount = () => {
    const newValue = Math.min(100, totals.safeDiscount + 1);
    setDiscount(newValue);
  };

  const decrementDiscount = () => {
    const newValue = Math.max(0, totals.safeDiscount - 1);
    setDiscount(newValue);
  };

  const styles = {
    summary: { marginBottom: "16px" },
    row: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 0",
      fontSize: "14px",
    },
    label: { color: theme.textSecondary },
    value: { fontWeight: "600", color: theme.textPrimary },

    discountRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 0",
    },
    discountInputSection: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    discountInputWrapper: {
      display: "flex",
      alignItems: "center",
      background: theme.inputBg,
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      overflow: "hidden",
    },
    discountInput: {
      width: "50px",
      padding: "8px 6px",
      border: "none",
      background: "transparent",
      color: theme.textPrimary,
      fontSize: "14px",
      fontWeight: "600",
      textAlign: "center",
      outline: "none",
      // Hide default number input arrows
      appearance: "textfield",
      MozAppearance: "textfield",
      WebkitAppearance: "none",
    },
    arrowButtons: {
      display: "flex",
      flexDirection: "column",
      borderLeft: `1px solid ${theme.border}`,
    },
    arrowButton: {
      padding: "2px 6px",
      border: "none",
      background: theme.bgHover,
      color: theme.textSecondary,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    },
    percentLabel: {
      fontSize: "13px",
      color: theme.textSecondary,
      fontWeight: "600",
    },

    divider: { height: "1px", background: theme.border, margin: "12px 0" },

    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
    },
    totalLabel: { fontSize: "16px", fontWeight: "700", color: theme.textPrimary },
    totalValue: { fontSize: "20px", fontWeight: "800", color: theme.success },
  };

  return (
    <div style={styles.summary}>
      <style>
        {`
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}
      </style>

      <div style={styles.row}>
        <span style={styles.label}>Sub Total</span>
        <span style={styles.value}>
          {SETTINGS.currency}
          {totals.subtotal.toFixed(2)}
        </span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>
          Tax ({(SETTINGS.taxRate * 100).toFixed(0)}%)
        </span>
        <span style={styles.value}>
          {SETTINGS.currency}
          {totals.taxAmount.toFixed(2)}
        </span>
      </div>

      <div style={styles.discountRow}>
        <span style={styles.label}>Discount</span>

        <div style={styles.discountInputSection}>
          <div style={styles.discountInputWrapper}>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="100"
              value={totals.safeDiscount}
              onChange={(e) => handleDiscountChange(e.target.value)}
              style={styles.discountInput}
            />
            <div style={styles.arrowButtons}>
              <button
                style={styles.arrowButton}
                onClick={incrementDiscount}
                onMouseEnter={(e) => e.currentTarget.style.background = theme.bgSecondary}
                onMouseLeave={(e) => e.currentTarget.style.background = theme.bgHover}
              >
                <ChevronUp size={14} />
              </button>
              <button
                style={styles.arrowButton}
                onClick={decrementDiscount}
                onMouseEnter={(e) => e.currentTarget.style.background = theme.bgSecondary}
                onMouseLeave={(e) => e.currentTarget.style.background = theme.bgHover}
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <span style={styles.percentLabel}>%</span>
          <span style={styles.value}>
            -{SETTINGS.currency}
            {totals.discountAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.totalRow}>
        <span style={styles.totalLabel}>Total</span>
        <span style={styles.totalValue}>
          {SETTINGS.currency}
          {totals.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;