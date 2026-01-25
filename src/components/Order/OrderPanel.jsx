import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import OrderItem from "./OrderItem";
import OrderSummary from "./OrderSummary";
import PaymentMethods from "./PaymentMethods";
import PaymentModal from "../Payment/PaymentModal";
import { ShoppingCart, X } from "lucide-react";

const OrderPanel = ({ onClose = () => {} }) => {
  const { theme } = useTheme();
  const { currentOrder } = usePOS();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalKey, setModalKey] = useState(0);

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
    
    // Mobile header with close button
    mobileHeader: {
      display: 'none',
      padding: '16px',
      borderBottom: `2px solid ${theme.border}`,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    mobileHeaderTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: theme.textPrimary,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    closeButton: {
      width: '36px',
      height: '36px',
      borderRadius: '8px',
      border: 'none',
      background: theme.bgSecondary,
      color: theme.textSecondary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
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
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
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
      flexShrink: 0,
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

    setModalKey(prev => prev + 1);
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
  };

  const totalItems = currentOrder.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <style>{`
        /* Hide scrollbar */
        .order-panel-list::-webkit-scrollbar {
          display: none;
        }

        /* Desktop (default - unchanged) */
        .order-panel {
          width: 400px;
          height: 100vh;
        }

        .order-mobile-header {
          display: none;
        }

        .order-desktop-header {
          display: block;
        }

        /* Tablet: Reduce width */
        @media (max-width: 1280px) {
          .order-panel {
            width: 350px !important;
          }
        }

        /* Mobile: Full width drawer */
        @media (max-width: 1024px) {
          .order-panel {
            width: 100% !important;
            height: auto !important;
            border-left: none !important;
            border-top: 2px solid ${theme.border};
          }

          .order-mobile-header {
            display: flex !important;
          }

          .order-desktop-header {
            display: none !important;
          }

          .order-panel-list {
            max-height: 35vh !important;
          }

          .order-panel-footer {
            padding: 14px !important;
          }
        }

        /* Small Mobile: More compact */
        @media (max-width: 768px) {
          .order-mobile-header {
            padding: 14px !important;
          }

          .order-mobile-header-title {
            font-size: 16px !important;
          }

          .order-panel-list {
            padding: 12px !important;
            max-height: 30vh !important;
          }

          .order-panel-footer {
            padding: 12px !important;
          }

          .order-place-button {
            padding: 14px !important;
            font-size: 15px !important;
          }
        }

        @media (max-width: 480px) {
          .order-mobile-header {
            padding: 12px !important;
          }

          .order-mobile-header-title {
            font-size: 15px !important;
          }

          .order-empty-state {
            padding: 30px 16px !important;
          }

          .order-empty-icon {
            width: 48px !important;
            height: 48px !important;
          }

          .order-empty-text {
            font-size: 13px !important;
          }
        }
      `}</style>

      <div className="order-panel" style={styles.panel}>
        {/* Mobile Header with Close Button */}
        <div className="order-mobile-header" style={styles.mobileHeader}>
          <div className="order-mobile-header-title" style={styles.mobileHeaderTitle}>
            <ShoppingCart size={20} />
            Your Order ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </div>
          <button 
            style={styles.closeButton}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="order-desktop-header" style={styles.header}>
          <div style={styles.headerTop}>
            <div style={styles.title}>New Order Bill</div>
          </div>
          <div style={styles.date}>{getCurrentDate()}</div>
        </div>

        {/* Order List */}
        <div className="order-panel-list" style={styles.orderList}>
          {currentOrder.length === 0 ? (
            <div className="order-empty-state" style={styles.emptyState}>
              <div className="order-empty-icon" style={styles.emptyIcon}>
                <ShoppingCart size={26} color={theme.textSecondary} />
              </div>
              <div className="order-empty-text" style={styles.emptyText}>
                No items in order
              </div>
            </div>
          ) : (
            currentOrder.map((item) => <OrderItem key={item.orderId} item={item} />)
          )}
        </div>

        {/* Footer */}
        <div className="order-panel-footer" style={styles.footer}>
          <OrderSummary />
          <PaymentMethods />
          <button
            className="order-place-button"
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

      {/* Payment Modal */}
      <PaymentModal 
        key={modalKey}
        isOpen={showPaymentModal} 
        onClose={handleCloseModal} 
      />
    </>
  );
};

export default OrderPanel;