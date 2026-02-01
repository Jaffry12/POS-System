// src/components/Order/OrderSummary.jsx
import { useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import { SETTINGS } from "../../data/menuData";

// Proper rounding function that always rounds .5 up (not banker's rounding)
const roundToTwo = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

const OrderSummary = () => {
  const { theme } = useTheme();
  const { currentOrder, discount, setDiscount } = usePOS();

  const totals = useMemo(() => {
    const subtotalCents = currentOrder.reduce((sum, item) => {
      const unit = Number(item?.price || 0);
      const qty = Number(item?.quantity || 0);
      return sum + unit * qty;
    }, 0);

    const subtotal = roundToTwo(subtotalCents / 100);
    const taxAmount = roundToTwo(subtotal * SETTINGS.taxRate);
    const safeDiscount = Number.isFinite(discount) ? Math.max(0, Math.min(100, discount)) : 0;
    const discountAmount = roundToTwo((subtotal * safeDiscount) / 100);
    const total = roundToTwo(subtotal + taxAmount - discountAmount);

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
    <>
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

          /* Tablet: 768px - 1024px */
          @media (max-width: 1024px) and (min-width: 768px) {
            .order-summary {
              margin-bottom: 14px !important;
            }
            .summary-row {
              padding: 7px 0 !important;
              font-size: 13px !important;
            }
            .summary-total-row {
              padding: 10px 0 !important;
            }
            .summary-total-label {
              font-size: 15px !important;
            }
            .summary-total-value {
              font-size: 18px !important;
            }
            .summary-discount-input {
              width: 45px !important;
              padding: 6px 5px !important;
              font-size: 13px !important;
            }
            .summary-percent-label {
              font-size: 12px !important;
            }
          }

          /* Mobile: 480px - 768px */
          @media (max-width: 768px) {
            .order-summary {
              margin-bottom: 12px !important;
            }
            .summary-row {
              padding: 6px 0 !important;
              font-size: 13px !important;
            }
            .summary-discount-row {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 8px !important;
              padding: 8px 0 !important;
            }
            .summary-discount-section {
              width: 100% !important;
              justify-content: space-between !important;
            }
            .summary-total-row {
              padding: 10px 0 !important;
            }
            .summary-total-label {
              font-size: 15px !important;
            }
            .summary-total-value {
              font-size: 18px !important;
            }
            .summary-divider {
              margin: 10px 0 !important;
            }
          }

          /* Small Mobile: < 480px */
          @media (max-width: 480px) {
            .order-summary {
              margin-bottom: 10px !important;
            }
            .summary-row {
              padding: 5px 0 !important;
              font-size: 12px !important;
            }
            .summary-discount-input {
              width: 40px !important;
              padding: 6px 4px !important;
              font-size: 12px !important;
            }
            .summary-arrow-btn {
              padding: 1px 5px !important;
            }
            .summary-percent-label {
              font-size: 11px !important;
            }
            .summary-total-row {
              padding: 8px 0 !important;
            }
            .summary-total-label {
              font-size: 14px !important;
            }
            .summary-total-value {
              font-size: 17px !important;
            }
            .summary-divider {
              margin: 8px 0 !important;
            }
          }
        `}
      </style>

      <div style={styles.summary} className="order-summary">
        <div style={styles.row} className="summary-row">
          <span style={styles.label}>Sub Total</span>
          <span style={styles.value}>
            {SETTINGS.currency}
            {totals.subtotal.toFixed(2)}
          </span>
        </div>

        <div style={styles.row} className="summary-row">
          <span style={styles.label}>
            Tax ({(SETTINGS.taxRate * 100).toFixed(0)}%)
          </span>
          <span style={styles.value}>
            {SETTINGS.currency}
            {totals.taxAmount.toFixed(2)}
          </span>
        </div>

        <div style={styles.discountRow} className="summary-row summary-discount-row">
          <span style={styles.label}>Discount</span>

          <div style={styles.discountInputSection} className="summary-discount-section">
            <div style={styles.discountInputWrapper}>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="100"
                value={totals.safeDiscount}
                onChange={(e) => handleDiscountChange(e.target.value)}
                style={styles.discountInput}
                className="summary-discount-input"
              />
              <div style={styles.arrowButtons}>
                <button
                  style={styles.arrowButton}
                  className="summary-arrow-btn"
                  onClick={incrementDiscount}
                  onMouseEnter={(e) => e.currentTarget.style.background = theme.bgSecondary}
                  onMouseLeave={(e) => e.currentTarget.style.background = theme.bgHover}
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  style={styles.arrowButton}
                  className="summary-arrow-btn"
                  onClick={decrementDiscount}
                  onMouseEnter={(e) => e.currentTarget.style.background = theme.bgSecondary}
                  onMouseLeave={(e) => e.currentTarget.style.background = theme.bgHover}
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
            <span style={styles.percentLabel} className="summary-percent-label">%</span>
            <span style={styles.value}>
              -{SETTINGS.currency}
              {totals.discountAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div style={styles.divider} className="summary-divider" />

        <div style={styles.totalRow} className="summary-total-row">
          <span style={styles.totalLabel} className="summary-total-label">Total</span>
          <span style={styles.totalValue} className="summary-total-value">
            {SETTINGS.currency}
            {totals.total.toFixed(2)}
          </span>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;