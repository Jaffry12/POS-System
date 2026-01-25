import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import OrderItem from "./OrderItem";
import OrderSummary from "./OrderSummary";
import PaymentMethods from "./PaymentMethods";
import PaymentModal from "../Payment/PaymentModal";
import { ShoppingCart } from "lucide-react";

const OrderPanel = () => {
  const { theme } = useTheme();
  const { currentOrder } = usePOS();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalKey, setModalKey] = useState(0); // ✅ Key to force modal reset

  const styles = {
    panel: {
      width: "400px",
      height: "100vh",
      background: theme.cardBg,
      borderLeft: `1px solid ${theme.border}`,
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      right: 0,
      top: 0,
    },
    header: {
      padding: "20px",
      borderBottom: `1px solid ${theme.border}`,
    },
    headerTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
    },
    title: {
      fontSize: "18px",
      fontWeight: "600",
      color: theme.textPrimary,
    },
    date: {
      fontSize: "12px",
      color: theme.textSecondary,
    },
    orderList: {
      flex: 1,
      overflowY: "auto",
      padding: "16px",
    },
    emptyState: {
      textAlign: "center",
      padding: "40px 20px",
      color: theme.textLight,
    },
    emptyIcon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "56px",
      height: "56px",
      borderRadius: "14px",
      background: theme.bgHover,
      marginBottom: "12px",
    },
    emptyText: {
      fontSize: "14px",
    },
    footer: {
      padding: "16px",
      borderTop: `1px solid ${theme.border}`,
    },
    placeOrderButton: {
      width: "100%",
      padding: "16px",
      border: "none",
      borderRadius: "10px",
      background: theme.success,
      color: "#FFFFFF",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginTop: "12px",
      opacity: currentOrder.length === 0 ? 0.6 : 1,
    },
  };

  const getCurrentDate = () => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date().toLocaleDateString("en-GB", options);
  };

  const handlePlaceOrder = () => {
    if (currentOrder.length === 0) {
      alert("Please add items to order");
      return;
    }

    // ✅ Increment key to force fresh modal state
    setModalKey(prev => prev + 1);
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    // Key will be different next time modal opens, ensuring clean state
  };

  return (
    <>
      <div style={styles.panel}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <div style={styles.title}>New Order Bill</div>
          </div>
          <div style={styles.date}>{getCurrentDate()}</div>
        </div>

        {/* Order List */}
        <div style={styles.orderList}>
          {currentOrder.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <ShoppingCart size={26} color={theme.textSecondary} />
              </div>
              <div style={styles.emptyText}>No items in order</div>
            </div>
          ) : (
            currentOrder.map((item) => <OrderItem key={item.orderId} item={item} />)
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <OrderSummary />
          <PaymentMethods />
          <button
            style={styles.placeOrderButton}
            onClick={handlePlaceOrder}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.opacity = currentOrder.length === 0 ? "0.6" : "1")
            }
            disabled={currentOrder.length === 0}
          >
            Place Order
          </button>
        </div>
      </div>

      {/* Payment Modal with key prop for clean state */}
      <PaymentModal 
        key={modalKey}
        isOpen={showPaymentModal} 
        onClose={handleCloseModal} 
      />
    </>
  );
};

export default OrderPanel;