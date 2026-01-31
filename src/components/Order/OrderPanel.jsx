// src/components/Order/OrderPanel.jsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import OrderItem from "./OrderItem";
import OrderSummary from "./OrderSummary";
import PaymentMethods from "./PaymentMethods";
import PaymentModal from "../Payment/PaymentModal";
import { ShoppingCart, X, Archive } from "lucide-react";

const OrderPanel = ({ onClose = () => {} }) => {
  const { theme } = useTheme();
  const { currentOrder, holdOrder } = usePOS();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  // ✅ measure footer height so list never hides under it
  const footerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(180);

  useLayoutEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const update = () => {
      const h = Math.ceil(el.getBoundingClientRect().height || 0);
      // Add a little buffer + safe-area
      setFooterHeight(h + 16);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [currentOrder.length]);

  const styles = {
    panel: {
      width: "400px",
      height: "100dvh",
      background: theme.cardBg,
      borderLeft: `1px solid ${theme.border}`,
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      right: 0,
      top: 0,
      boxSizing: "border-box",

      /* ✅ keep clean layout */
      overflow: "hidden",
    },

    mobileHeader: {
      display: "none",
      padding: "16px",
      borderBottom: `2px solid ${theme.border}`,
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
      background: theme.cardBg,
    },
    mobileHeaderTitle: {
      fontSize: "18px",
      fontWeight: "700",
      color: theme.textPrimary,
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    closeButton: {
      width: "36px",
      height: "36px",
      borderRadius: "8px",
      border: "none",
      background: theme.bgSecondary,
      color: theme.textSecondary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },

    header: {
      padding: "20px",
      borderBottom: `1px solid ${theme.border}`,
      flexShrink: 0,
      background: theme.cardBg,
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
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      minHeight: 0,

      /* ✅ CRITICAL: never hide last item behind footer */
      paddingBottom: `calc(${footerHeight}px + env(safe-area-inset-bottom, 0px))`,
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
      background: theme.cardBg,

      /* ✅ ALWAYS visible */
      position: "sticky",
      bottom: 0,
      zIndex: 50,

      /* ✅ safe area so buttons never go under device bar */
      paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))",

      boxShadow: "0 -6px 18px rgba(0,0,0,0.10)",
    },

    buttonContainer: {
      display: "flex",
      gap: "10px",
      marginTop: "12px",
    },

    holdButton: {
      flex: "0 0 auto",
      padding: "16px",
      border: `2px solid ${theme.warning}`,
      borderRadius: "10px",
      background: "transparent",
      color: theme.warning,
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      opacity: currentOrder.length === 0 ? 0.6 : 1,
    },

    placeOrderButton: {
      flex: 1,
      padding: "16px",
      border: "none",
      borderRadius: "10px",
      background: theme.success,
      color: "#FFFFFF",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
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
    setModalKey((prev) => prev + 1);
    setShowPaymentModal(true);
  };

  const handleHoldOrder = () => {
    if (currentOrder.length === 0) {
      alert("Please add items to hold");
      return;
    }

    const result = holdOrder();
    if (result) console.log("Order held successfully!");
  };

  const handleCloseModal = () => setShowPaymentModal(false);

  const totalItems = currentOrder.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <style>{`
        .order-panel-list::-webkit-scrollbar { display: none; }

        .order-panel { width: 400px; height: 100dvh; }
        .order-mobile-header { display: none; }
        .order-desktop-header { display: block; }

        @media (max-width: 1280px) {
          .order-panel { width: 350px !important; }
        }

        /* Mobile sheet mode */
        @media (max-width: 1024px) {
          .order-panel {
            width: 100% !important;
            height: auto !important;
            max-height: 85vh !important;
            border-left: none !important;
            border: none !important;
            position: relative !important;
            right: auto !important;
            top: auto !important;
          }

          .order-mobile-header { display: flex !important; }
          .order-desktop-header { display: none !important; }

          .order-panel-footer {
            position: sticky !important;
            bottom: 0 !important;
            z-index: 50 !important;
          }

          .order-panel-list {
            max-height: 40vh !important;
            overflow-y: auto !important;
          }
        }

        /* Small Mobile */
        @media (max-width: 768px) {
          .order-mobile-header { padding: 14px !important; }
          .order-mobile-header-title { font-size: 16px !important; }

          .order-panel-list {
            padding: 12px !important;
            max-height: 35vh !important;
          }

          .order-panel-footer { padding: 12px !important; }

          .order-button-container { 
            flex-direction: column !important;
            gap: 8px !important;
          }

          .order-hold-button, .order-place-button { 
            padding: 14px !important; 
            font-size: 15px !important;
            flex: 1 !important;
          }
        }

        @media (max-width: 480px) {
          .order-mobile-header { padding: 12px !important; }
          .order-mobile-header-title { font-size: 15px !important; }

          .order-empty-state { padding: 30px 16px !important; }
          .order-empty-icon { width: 48px !important; height: 48px !important; }
          .order-empty-text { font-size: 13px !important; }

          .order-panel-list { max-height: 32vh !important; }
        }

        .order-hold-button:hover:not(:disabled) {
          background: rgba(251, 191, 36, 0.1) !important;
          transform: translateY(-1px);
        }

        .order-place-button:hover:not(:disabled) {
          opacity: 0.9 !important;
        }
      `}</style>

      <div className="order-panel" style={styles.panel}>
        <div className="order-mobile-header" style={styles.mobileHeader}>
          <div
            className="order-mobile-header-title"
            style={styles.mobileHeaderTitle}
          >
            <ShoppingCart size={20} />
            Your Order ({totalItems} {totalItems === 1 ? "item" : "items"})
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="order-desktop-header" style={styles.header}>
          <div style={styles.headerTop}>
            <div style={styles.title}>New Order Bill</div>
          </div>
          <div style={styles.date}>{getCurrentDate()}</div>
        </div>

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
            currentOrder.map((item) => (
              <OrderItem key={item.orderId} item={item} />
            ))
          )}
        </div>

        <div
          ref={footerRef}
          className="order-panel-footer"
          style={styles.footer}
        >
          <OrderSummary />
          <PaymentMethods />

          <div className="order-button-container" style={styles.buttonContainer}>
            <button
              className="order-hold-button"
              style={styles.holdButton}
              onClick={handleHoldOrder}
              disabled={currentOrder.length === 0}
              title="Hold this order"
            >
              <Archive size={18} />
            </button>
            <button
              className="order-place-button"
              style={styles.placeOrderButton}
              onClick={handlePlaceOrder}
              disabled={currentOrder.length === 0}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      <PaymentModal
        key={modalKey}
        isOpen={showPaymentModal}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default OrderPanel;
