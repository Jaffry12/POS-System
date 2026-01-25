// src/components/Order/OrderItem.jsx
import { Minus, Plus, Trash2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import { SETTINGS } from "../../data/menuData";

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

  // Convert cents to dollars
  const unit = Number(item?.price || 0) / 100;
  const lineTotal = unit * Number(item?.quantity || 1);

  // Display size if available
  const sizeDisplay = item.size ? ` (${item.size})` : '';

  return (
    <div style={styles.item}>
      <div style={styles.details}>
        {/* Top Row: Name and Unit Price */}
        <div style={styles.topRow}>
          <div style={styles.name}>
            {item.name}{sizeDisplay}
          </div>
          <div style={styles.unitPrice}>
            {SETTINGS.currency}{unit.toFixed(2)}
          </div>
        </div>

        {/* Modifiers */}
        {hasModifiers && (
          <div style={styles.modifiers}>
            {modifierLines.map((m, idx) => (
              <div key={idx} style={styles.modifierText}>
                {m.name}
                {m.price > 0 && ` +${SETTINGS.currency}${(Number(m.price || 0) / 100).toFixed(2)}`}
              </div>
            ))}
          </div>
        )}

        {/* Bottom Row: Line Total and Controls */}
        <div style={styles.bottomRow}>
          <div style={styles.lineTotal}>
            Line: {SETTINGS.currency}{lineTotal.toFixed(2)}
          </div>

          <div style={styles.controls}>
            <button
              style={styles.quantityButton}
              onClick={() => updateQuantity(item.orderId, item.quantity - 1)}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Minus size={14} />
            </button>

            <div style={styles.quantity}>{item.quantity}</div>

            <button
              style={styles.quantityButton}
              onClick={() => updateQuantity(item.orderId, item.quantity + 1)}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Plus size={14} />
            </button>

            <button
              style={styles.removeButton}
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
  );
};

export default OrderItem;