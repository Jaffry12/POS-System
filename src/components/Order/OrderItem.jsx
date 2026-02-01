// src/components/Order/OrderItem.jsx
import { Minus, Plus, Trash2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import { SETTINGS } from "../../data/menuData";

// Format price to remove trailing zero (9.90 becomes 9.9)
const formatPrice = (priceInCents) => {
  const dollars = (priceInCents / 100).toFixed(2);
  // Remove trailing zero: "9.90" -> "9.9", but keep "10.00" -> "10.0" -> "10"
  return dollars.replace(/\.?0+$/, '').replace(/\.$/, '.0');
};

const OrderItem = ({ item }) => {
  const { theme } = useTheme();
  const { updateQuantity, removeFromOrder } = usePOS();

  const modifierLines =
    item?.modifiers
      ?.flatMap((g) => (g?.options || []).map((o) => ({ group: g.groupTitle, ...o }))) || [];

  const hasModifiers = modifierLines.length > 0;

  const styles = {
    item: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px",
      background: theme.bgSecondary,
      borderRadius: "10px",
      marginBottom: "10px",
    },
    details: {
      flex: 1,
      minWidth: 0,
    },
    topRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "4px",
    },
    name: {
      fontSize: "14px",
      fontWeight: "600",
      color: theme.textPrimary,
      lineHeight: 1.2,
    },
    unitPrice: {
      fontSize: "13px",
      fontWeight: "700",
      color: theme.primary,
      whiteSpace: "nowrap",
    },
    modifiers: {
      fontSize: "11px",
      color: theme.textLight,
      marginBottom: "6px",
    },
    modifierText: {
      marginBottom: "2px",
    },
    bottomRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    lineTotal: {
      fontSize: "12px",
      fontWeight: "700",
      color: theme.textSecondary,
    },
    controls: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    quantityButton: {
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      border: "none",
      background: theme.warning,
      color: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    quantity: {
      fontSize: "14px",
      fontWeight: "600",
      color: theme.textPrimary,
      minWidth: "20px",
      textAlign: "center",
    },
    removeButton: {
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      border: "none",
      background: theme.danger,
      color: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
  };

  const unit = Number(item?.price || 0);
  const lineTotal = unit * Number(item?.quantity || 1);
  const sizeDisplay = item.size ? ` (${item.size})` : '';

  return (
    <>
      <style>{`
        /* Tablet: 768px - 1024px */
        @media (max-width: 1024px) and (min-width: 768px) {
          .order-item {
            padding: 10px !important;
            gap: 10px !important;
            margin-bottom: 8px !important;
          }
          .order-item-name {
            font-size: 13px !important;
          }
          .order-item-price {
            font-size: 12px !important;
          }
          .order-item-modifiers {
            font-size: 10px !important;
            margin-bottom: 5px !important;
          }
          .order-item-total {
            font-size: 11px !important;
          }
          .order-item-controls {
            gap: 6px !important;
          }
          .order-item-btn {
            width: 26px !important;
            height: 26px !important;
          }
          .order-item-qty {
            font-size: 13px !important;
            min-width: 18px !important;
          }
        }

        /* Mobile: 480px - 768px */
        @media (max-width: 768px) {
          .order-item {
            padding: 10px !important;
            gap: 8px !important;
            margin-bottom: 8px !important;
          }
          .order-item-top {
            flex-wrap: wrap !important;
            gap: 4px !important;
          }
          .order-item-name {
            font-size: 13px !important;
            flex: 1 1 100% !important;
          }
          .order-item-price {
            font-size: 12px !important;
          }
          .order-item-modifiers {
            font-size: 10px !important;
            margin-bottom: 5px !important;
          }
          .order-item-bottom {
            flex-wrap: wrap !important;
            gap: 6px !important;
          }
          .order-item-total {
            font-size: 11px !important;
            flex: 1 1 100% !important;
          }
          .order-item-controls {
            gap: 6px !important;
            width: 100% !important;
            justify-content: flex-end !important;
          }
          .order-item-btn {
            width: 32px !important;
            height: 32px !important;
          }
          .order-item-qty {
            font-size: 14px !important;
            min-width: 24px !important;
          }
        }

        /* Small Mobile: < 480px */
        @media (max-width: 480px) {
          .order-item {
            padding: 8px !important;
            gap: 6px !important;
            margin-bottom: 6px !important;
          }
          .order-item-name {
            font-size: 12px !important;
          }
          .order-item-price {
            font-size: 11px !important;
          }
          .order-item-modifiers {
            font-size: 9px !important;
            margin-bottom: 4px !important;
          }
          .order-item-total {
            font-size: 10px !important;
          }
          .order-item-btn {
            width: 30px !important;
            height: 30px !important;
          }
          .order-item-qty {
            font-size: 13px !important;
            min-width: 20px !important;
          }
        }
      `}</style>

      <div style={styles.item} className="order-item">
        <div style={styles.details}>
          <div style={styles.topRow} className="order-item-top">
            <div style={styles.name} className="order-item-name">
              {item.name}{sizeDisplay}
            </div>
            <div style={styles.unitPrice} className="order-item-price">
              {SETTINGS.currency}{formatPrice(unit)}
            </div>
          </div>

          {hasModifiers && (
            <div style={styles.modifiers} className="order-item-modifiers">
              {modifierLines.map((m, idx) => (
                <div key={idx} style={styles.modifierText}>
                  {m.name}
                  {m.price > 0 && ` +${SETTINGS.currency}${formatPrice(Number(m.price || 0))}`}
                </div>
              ))}
            </div>
          )}

          <div style={styles.bottomRow} className="order-item-bottom">
            <div style={styles.lineTotal} className="order-item-total">
              Line: {SETTINGS.currency}{formatPrice(lineTotal)}
            </div>

            <div style={styles.controls} className="order-item-controls">
              <button
                style={styles.quantityButton}
                className="order-item-btn"
                onClick={() => updateQuantity(item.orderId, item.quantity - 1)}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <Minus size={14} />
              </button>

              <div style={styles.quantity} className="order-item-qty">{item.quantity}</div>

              <button
                style={styles.quantityButton}
                className="order-item-btn"
                onClick={() => updateQuantity(item.orderId, item.quantity + 1)}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <Plus size={14} />
              </button>

              <button
                style={styles.removeButton}
                className="order-item-btn"
                onClick={() => removeFromOrder(item.orderId)}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderItem;