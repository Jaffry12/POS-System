// src/components/pages/HeldOrdersPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Trash2, Package, Eye, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";

const HeldOrdersPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { heldOrders, unholdOrder, deleteHeldOrder } = usePOS();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const styles = {
    container: {
      height: "100vh",
      background: theme.bgPrimary,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    header: {
      background: theme.bgCard,
      borderBottom: `1px solid ${theme.border}`,
      padding: "16px 24px",
      flexShrink: 0,
    },
    headerContent: {
      maxWidth: "1600px",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      gap: "14px",
    },
    backButton: {
      width: "44px",
      height: "44px",
      borderRadius: "10px",
      border: "none",
      background: theme.bgSecondary,
      color: theme.textPrimary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s",
      flexShrink: 0,
    },
    headerTitle: {
      fontSize: "20px",
      fontWeight: "700",
      color: theme.textPrimary,
    },
    headerCount: {
      fontSize: "14px",
      color: theme.textSecondary,
      fontWeight: "500",
      marginTop: "2px",
    },
    content: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      minHeight: 0,
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    contentInner: {
      maxWidth: "1600px",
      margin: "0 auto",
      padding: "20px",
      paddingBottom: "100px",
    },
    emptyState: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "60vh",
      textAlign: "center",
    },
    emptyIcon: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      background: theme.bgSecondary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "20px",
    },
    emptyTitle: {
      fontSize: "22px",
      fontWeight: "700",
      color: theme.textPrimary,
      marginBottom: "10px",
    },
    emptyDescription: {
      fontSize: "15px",
      color: theme.textSecondary,
      maxWidth: "400px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "14px",
      alignItems: "stretch",
    },
    card: {
      background: theme.cardBg,
      border: `2px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "12px",
      transition: "all 0.2s ease",
      display: "flex",
      flexDirection: "column",
      height: "220px",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "10px",
      paddingBottom: "8px",
      borderBottom: `1px solid ${theme.border}`,
      flexShrink: 0,
    },
    orderInfo: {
      flex: 1,
      minWidth: 0,
    },
    timeInfo: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      color: theme.textSecondary,
      fontSize: "11px",
    },
    deleteBtn: {
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      border: "none",
      background: "#fee",
      color: "#dc2626",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s",
      flexShrink: 0,
    },
    itemsList: {
      flex: 1,
      overflowY: "auto",
      marginBottom: "8px",
      minHeight: 0,
    },
    item: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "5px 0",
      fontSize: "12px",
      borderBottom: `1px solid ${theme.bgSecondary}`,
    },
    itemQty: {
      fontWeight: "700",
      color: theme.primary,
      minWidth: "26px",
      fontSize: "11px",
    },
    itemName: {
      flex: 1,
      color: theme.textPrimary,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    itemPrice: {
      fontWeight: "600",
      color: theme.textPrimary,
      fontSize: "11px",
      flexShrink: 0,
    },
    cardFooter: {
      flexShrink: 0,
      paddingTop: "8px",
      borderTop: `1px solid ${theme.border}`,
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "6px",
    },
    totalLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: theme.textSecondary,
    },
    totalAmount: {
      fontSize: "16px",
      fontWeight: "700",
      color: theme.textPrimary,
    },
    viewButton: {
      width: "100%",
      padding: "7px",
      border: `1px solid ${theme.primary}`,
      borderRadius: "8px",
      background: "transparent",
      color: theme.primary,
      fontSize: "11px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "5px",
      transition: "all 0.2s",
    },
    
    // Modal styles
    modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      background: theme.cardBg,
      borderRadius: "16px",
      width: "100%",
      maxWidth: "500px",
      maxHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    modalHeader: {
      padding: "20px",
      borderBottom: `1px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
    },
    modalTitle: {
      fontSize: "20px",
      fontWeight: "700",
      color: theme.textPrimary,
    },
    modalCloseBtn: {
      width: "36px",
      height: "36px",
      borderRadius: "8px",
      border: "none",
      background: theme.bgSecondary,
      color: theme.textPrimary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    modalContent: {
      flex: 1,
      overflowY: "auto",
      padding: "20px",
    },
    modalItem: {
      padding: "12px 0",
      borderBottom: `1px solid ${theme.border}`,
      display: "flex",
      gap: "12px",
    },
    modalItemQty: {
      fontWeight: "700",
      color: theme.primary,
      fontSize: "14px",
      minWidth: "35px",
    },
    modalItemDetails: {
      flex: 1,
    },
    modalItemName: {
      fontSize: "15px",
      fontWeight: "600",
      color: theme.textPrimary,
      marginBottom: "4px",
    },
    modalItemSize: {
      fontSize: "13px",
      color: theme.textSecondary,
    },
    modalItemPrice: {
      fontSize: "14px",
      fontWeight: "600",
      color: theme.textPrimary,
      flexShrink: 0,
    },
    modalFooter: {
      padding: "20px",
      borderTop: `1px solid ${theme.border}`,
      flexShrink: 0,
    },
    modalTotal: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
      fontSize: "18px",
      fontWeight: "700",
    },
    modalActions: {
      display: "flex",
      gap: "12px",
    },
    retrieveBtn: {
      flex: 1,
      padding: "14px",
      border: "none",
      borderRadius: "10px",
      background: theme.success,
      color: "#FFFFFF",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    modalDeleteBtn: {
      padding: "14px 20px",
      border: "none",
      borderRadius: "10px",
      background: "#dc2626",
      color: "#FFFFFF",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
    },
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price / 100) * item.quantity, 0);
  };

  const handleUnhold = (holdId) => {
    unholdOrder(holdId);
    setSelectedOrder(null);
    navigate("/");
  };

  const handleDelete = (holdId, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this held order?")) {
      deleteHeldOrder(holdId);
      setSelectedOrder(null);
    }
  };

  const handleViewDetails = (order, e) => {
    e.stopPropagation();
    setSelectedOrder(order);
  };

  return (
    <>
      <style>{`
        /* Hide scrollbar completely */
        .held-orders-content::-webkit-scrollbar {
          display: none;
        }
        .held-orders-content {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .held-items-list::-webkit-scrollbar {
          display: none;
        }
        .held-items-list {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .held-modal-content::-webkit-scrollbar {
          width: 6px;
        }
        .held-modal-content::-webkit-scrollbar-track {
          background: ${theme.bgSecondary};
          border-radius: 3px;
        }
        .held-modal-content::-webkit-scrollbar-thumb {
          background: ${theme.border};
          border-radius: 3px;
        }

        .held-card:hover {
          border-color: ${theme.primary};
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .held-delete-btn:hover {
          background: #fcc !important;
          transform: scale(1.05);
        }

        .held-back-btn:hover {
          background: ${theme.bgHover} !important;
          transform: translateX(-2px);
        }

        .held-view-btn:hover {
          background: ${theme.primaryLight} !important;
        }

        .held-retrieve-btn:hover {
          opacity: 0.9;
        }

        .held-modal-delete-btn:hover {
          opacity: 0.9;
        }

        .held-modal-close-btn:hover {
          background: ${theme.bgHover} !important;
        }

        /* Desktop - 4 columns */
        @media (min-width: 1400px) {
          .held-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }

        /* Large screens - 3 columns */
        @media (min-width: 1024px) and (max-width: 1399px) {
          .held-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }

          .held-content-inner {
            padding: 20px !important;
            padding-bottom: 100px !important;
          }
        }

        /* Tablet - 2 columns */
        @media (min-width: 768px) and (max-width: 1023px) {
          .held-header {
            padding: 14px 20px !important;
          }
          
          .held-header-title {
            font-size: 18px !important;
          }
          
          .held-content-inner {
            padding: 18px !important;
            padding-bottom: 90px !important;
          }
          
          .held-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          
          .held-card {
            padding: 11px !important;
            height: 210px !important;
          }

          .held-order-number {
            font-size: 15px !important;
          }

          .held-total-amount {
            font-size: 16px !important;
          }
        }

        /* Mobile - 1 column */
        @media (max-width: 767px) {
          .held-header {
            padding: 12px 16px !important;
          }
          
          .held-back-btn {
            width: 40px !important;
            height: 40px !important;
            border-radius: 8px !important;
          }
          
          .held-header-title {
            font-size: 17px !important;
          }
          
          .held-header-count {
            font-size: 13px !important;
          }
          
          .held-content-inner {
            padding: 14px !important;
            padding-bottom: 80px !important;
          }
          
          .held-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          
          .held-card {
            padding: 11px !important;
            height: 200px !important;
          }
          
          .held-order-number {
            font-size: 15px !important;
          }
          
          .held-time-info {
            font-size: 11px !important;
          }
          
          .held-delete-btn {
            width: 32px !important;
            height: 32px !important;
          }
          
          .held-item {
            padding: 5px 0 !important;
            font-size: 12px !important;
          }

          .held-item-qty {
            font-size: 11px !important;
          }

          .held-item-price {
            font-size: 11px !important;
          }
          
          .held-total-label {
            font-size: 12px !important;
          }

          .held-total-amount {
            font-size: 16px !important;
          }
          
          .held-view-btn {
            font-size: 11px !important;
            padding: 7px !important;
          }
          
          .held-empty-icon {
            width: 80px !important;
            height: 80px !important;
          }
          
          .held-empty-title {
            font-size: 18px !important;
          }
          
          .held-empty-description {
            font-size: 13px !important;
          }

          .held-modal {
            max-width: 95% !important;
            margin: 10px !important;
          }

          .held-modal-header {
            padding: 16px !important;
          }

          .held-modal-title {
            font-size: 18px !important;
          }

          .held-modal-content {
            padding: 16px !important;
          }

          .held-modal-footer {
            padding: 16px !important;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .held-header {
            padding: 10px 12px !important;
          }
          
          .held-back-btn {
            width: 36px !important;
            height: 36px !important;
          }
          
          .held-header-title {
            font-size: 16px !important;
          }
          
          .held-content-inner {
            padding: 12px !important;
            padding-bottom: 70px !important;
          }
          
          .held-card {
            padding: 10px !important;
            height: 190px !important;
          }
          
          .held-order-number {
            font-size: 14px !important;
          }

          .held-delete-btn {
            width: 30px !important;
            height: 30px !important;
          }
          
          .held-empty-icon {
            width: 70px !important;
            height: 70px !important;
          }
          
          .held-empty-title {
            font-size: 16px !important;
          }
          
          .held-empty-description {
            font-size: 12px !important;
          }
        }
      `}</style>

      <div style={styles.container}>
        <div className="held-header" style={styles.header}>
          <div style={styles.headerContent}>
            <button
              className="held-back-btn"
              style={styles.backButton}
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="held-header-title" style={styles.headerTitle}>
                Held Orders
              </div>
              <div className="held-header-count" style={styles.headerCount}>
                {heldOrders.length} {heldOrders.length === 1 ? "order" : "orders"} on hold
              </div>
            </div>
          </div>
        </div>

        <div className="held-orders-content" style={styles.content}>
          <div className="held-content-inner" style={styles.contentInner}>
            {heldOrders.length === 0 ? (
              <div style={styles.emptyState}>
                <div className="held-empty-icon" style={styles.emptyIcon}>
                  <Package size={50} color={theme.textSecondary} />
                </div>
                <div className="held-empty-title" style={styles.emptyTitle}>
                  No Held Orders
                </div>
                <div className="held-empty-description" style={styles.emptyDescription}>
                  When you hold an order, it will appear here for easy retrieval
                </div>
              </div>
            ) : (
              <div className="held-grid" style={styles.grid}>
                {heldOrders.map((order) => (
                  <div
                    key={order.id}
                    className="held-card"
                    style={styles.card}
                  >
                    <div style={styles.cardHeader}>
                      <div style={styles.orderInfo}>
                        <div className="held-time-info" style={styles.timeInfo}>
                          <Clock size={12} />
                          <span>{formatTime(order.timestamp)}</span>
                        </div>
                      </div>
                      <button
                        className="held-delete-btn"
                        style={styles.deleteBtn}
                        onClick={(e) => handleDelete(order.id, e)}
                        title="Delete held order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="held-items-list" style={styles.itemsList}>
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="held-item" style={styles.item}>
                          <span className="held-item-qty" style={styles.itemQty}>
                            {item.quantity}x
                          </span>
                          <span className="held-item-name" style={styles.itemName} title={item.name + (item.size ? ` (${item.size})` : '')}>
                            {item.name}
                            {item.size && ` (${item.size})`}
                          </span>
                          <span className="held-item-price" style={styles.itemPrice}>
                            CA${((item.price / 100) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div style={{ ...styles.item, borderBottom: 'none', paddingTop: '8px' }}>
                          <span style={{ fontSize: '12px', color: theme.textSecondary, fontStyle: 'italic' }}>
                            +{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={styles.cardFooter}>
                      <div style={styles.totalRow}>
                        <span className="held-total-label" style={styles.totalLabel}>
                          Total:
                        </span>
                        <span className="held-total-amount" style={styles.totalAmount}>
                          CA${calculateTotal(order.items).toFixed(2)}
                        </span>
                      </div>
                      <button
                        className="held-view-btn"
                        style={styles.viewButton}
                        onClick={(e) => handleViewDetails(order, e)}
                      >
                        <Eye size={14} />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedOrder && (
          <div style={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
            <div className="held-modal" style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className="held-modal-header" style={styles.modalHeader}>
                <div>
                  <div className="held-modal-title" style={styles.modalTitle}>
                    Held Order
                  </div>
                  <div style={{ fontSize: '13px', color: theme.textSecondary, marginTop: '4px' }}>
                    {formatTime(selectedOrder.timestamp)}
                  </div>
                </div>
                <button
                  className="held-modal-close-btn"
                  style={styles.modalCloseBtn}
                  onClick={() => setSelectedOrder(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="held-modal-content" style={styles.modalContent}>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} style={styles.modalItem}>
                    <span style={styles.modalItemQty}>{item.quantity}x</span>
                    <div style={styles.modalItemDetails}>
                      <div style={styles.modalItemName}>{item.name}</div>
                      {item.size && (
                        <div style={styles.modalItemSize}>Size: {item.size}</div>
                      )}
                      {item.modifiers && item.modifiers.length > 0 && (
                        <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '4px' }}>
                          {item.modifiers.map((mod, idx) => (
                            <div key={idx}>
                              {mod.groupTitle}: {mod.options.map(opt => opt.name).join(', ')}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span style={styles.modalItemPrice}>
                      CA${((item.price / 100) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="held-modal-footer" style={styles.modalFooter}>
                <div style={styles.modalTotal}>
                  <span>Total:</span>
                  <span>CA${calculateTotal(selectedOrder.items).toFixed(2)}</span>
                </div>
                <div style={styles.modalActions}>
                  <button
                    className="held-retrieve-btn"
                    style={styles.retrieveBtn}
                    onClick={() => handleUnhold(selectedOrder.id)}
                  >
                    Retrieve Order
                  </button>
                  <button
                    className="held-modal-delete-btn"
                    style={styles.modalDeleteBtn}
                    onClick={(e) => handleDelete(selectedOrder.id, e)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HeldOrdersPage;