// src/components/Layout/TopBar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Archive } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import AddCustomItemModal from "../Order/AddCustomItemModal";

const TopBar = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, orderNumber, heldOrders } = usePOS();
  const [showCustomItemModal, setShowCustomItemModal] = useState(false);

  const styles = {
    topBar: {
      background: theme.bgCard,
      borderBottom: `1px solid ${theme.border}`,
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
      flexWrap: "wrap",
    },
    leftSection: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flex: 1,
      minWidth: 0,
    },
    searchContainer: {
      position: "relative",
      flex: 1,
      maxWidth: "400px",
      minWidth: 0,
    },
    searchIcon: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: theme.textLight,
      pointerEvents: "none",
    },
    searchInput: {
      width: "100%",
      padding: "10px 12px 10px 40px",
      border: `1px solid ${theme.inputBorder}`,
      borderRadius: "8px",
      background: theme.inputBg,
      color: theme.textPrimary,
      fontSize: "14px",
      outline: "none",
    },
    buttonGroup: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flexShrink: 0,
    },
    heldOrdersButton: {
      padding: "8px 16px",
      border: `2px solid ${theme.warning}`,
      borderRadius: "8px",
      background: "transparent",
      color: theme.warning,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      fontWeight: "600",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
      flexShrink: 0,
      position: "relative",
    },
    heldBadge: {
      position: "absolute",
      top: "-6px",
      right: "-6px",
      background: theme.danger,
      color: "#FFFFFF",
      borderRadius: "50%",
      minWidth: "20px",
      height: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "11px",
      fontWeight: "700",
      padding: "0 4px",
      border: `2px solid ${theme.bgCard}`,
    },
    addButton: {
      padding: "8px 16px",
      border: "none",
      borderRadius: "8px",
      background: theme.success,
      color: "#FFFFFF",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      fontWeight: "600",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
      flexShrink: 0,
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      flexShrink: 0,
    },
    orderInfo: {
      textAlign: "right",
    },
    orderNumber: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.textPrimary,
      lineHeight: "1.2",
    },
    orderDate: {
      fontSize: "12px",
      color: theme.textSecondary,
      lineHeight: "1.2",
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

  return (
    <>
      <style>{`
        /* Desktop - Default styling */
        .topbar-responsive {
          padding: 16px 24px;
        }

        .topbar-left-section {
          flex: 1;
          min-width: 0;
          gap: 12px;
        }

        .topbar-search-container {
          max-width: 400px;
        }

        .topbar-button-group {
          gap: 10px;
        }

        .topbar-held-button,
        .topbar-add-button {
          padding: 8px 16px;
          font-size: 13px;
        }

        .topbar-button-text {
          display: inline;
        }

        .topbar-order-date {
          display: block;
        }

        .topbar-held-button:hover {
          background: rgba(251, 191, 36, 0.1);
          transform: translateY(-1px);
        }

        .topbar-add-button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        /* Tablet: Smaller buttons with text */
        @media (max-width: 1024px) {
          .topbar-responsive {
            padding: 14px 20px !important;
          }
          
          .topbar-left-section {
            gap: 10px !important;
          }
          
          .topbar-search-container {
            max-width: 280px !important;
          }

          .topbar-button-group {
            gap: 8px !important;
          }

          .topbar-held-button,
          .topbar-add-button {
            padding: 7px 12px !important;
            font-size: 12px !important;
            gap: 5px !important;
          }

          .topbar-held-button svg,
          .topbar-add-button svg {
            width: 16px !important;
            height: 16px !important;
          }

          .topbar-order-number {
            font-size: 15px !important;
          }

          .topbar-order-date {
            font-size: 11px !important;
          }
        }

        /* Mobile: Icon-only compact buttons */
        @media (max-width: 768px) {
          .topbar-responsive {
            padding: 12px 16px 12px 70px !important;
            gap: 10px !important;
            flex-wrap: nowrap !important;
          }
          
          .topbar-left-section {
            flex: 1 !important;
            min-width: 0 !important;
            gap: 8px !important;
            display: flex !important;
            align-items: center !important;
          }
          
          .topbar-search-container {
            flex: 1 !important;
            max-width: none !important;
            min-width: 0 !important;
          }
          
          .topbar-search-container input {
            padding-left: 36px !important;
            font-size: 13px !important;
          }

          .topbar-button-group {
            gap: 6px !important;
          }
          
          /* Icon-only buttons on mobile */
          .topbar-held-button,
          .topbar-add-button {
            width: 42px !important;
            height: 42px !important;
            min-width: 42px !important;
            padding: 0 !important;
            border-radius: 10px !important;
            justify-content: center !important;
            flex-shrink: 0 !important;
          }

          .topbar-held-button svg,
          .topbar-add-button svg {
            width: 18px !important;
            height: 18px !important;
          }
          
          .topbar-button-text {
            display: none !important;
          }
          
          .topbar-right-section {
            display: none !important;
          }
        }

        /* Small Mobile: Even more compact */
        @media (max-width: 480px) {
          .topbar-responsive {
            padding: 10px 12px 10px 64px !important;
            gap: 6px !important;
          }
          
          .topbar-left-section {
            gap: 6px !important;
          }

          .topbar-button-group {
            gap: 5px !important;
          }
          
          .topbar-held-button,
          .topbar-add-button {
            width: 40px !important;
            height: 40px !important;
            min-width: 40px !important;
            border-radius: 8px !important;
          }

          .topbar-held-button svg,
          .topbar-add-button svg {
            width: 16px !important;
            height: 16px !important;
          }
          
          .topbar-search-container input {
            font-size: 12px !important;
            padding: 8px 10px 8px 32px !important;
          }
          
          .topbar-search-icon {
            left: 10px !important;
          }

          .topbar-search-icon svg {
            width: 16px !important;
            height: 16px !important;
          }
        }
      `}</style>

      <div className="topbar-responsive" style={styles.topBar}>
        <div className="topbar-left-section" style={styles.leftSection}>
          <div className="topbar-search-container" style={styles.searchContainer}>
            <Search size={18} style={styles.searchIcon} className="topbar-search-icon" />
            <input
              type="text"
              placeholder="Search Categories or Menu..."
              style={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="topbar-button-group" style={styles.buttonGroup}>
            {/* Held Orders Button */}
            <button
              className="topbar-held-button"
              style={styles.heldOrdersButton}
              onClick={() => navigate("/held-orders")}
              title="View held orders"
            >
              <Archive size={18} />
              <span className="topbar-button-text">Held</span>
              {heldOrders.length > 0 && (
                <div style={styles.heldBadge}>{heldOrders.length}</div>
              )}
            </button>

            {/* Add New Item Button */}
            <button
              className="topbar-add-button"
              style={styles.addButton}
              onClick={() => setShowCustomItemModal(true)}
              title="Add new item"
            >
              <Plus size={18} />
              <span className="topbar-button-text">Add Item</span>
            </button>
          </div>
        </div>

        <div className="topbar-right-section" style={styles.rightSection}>
          <div className="topbar-order-info" style={styles.orderInfo}>
            <div className="topbar-order-number" style={styles.orderNumber}>
              Order #{orderNumber}
            </div>
            <div className="topbar-order-date" style={styles.orderDate}>
              {getCurrentDate()}
            </div>
          </div>
        </div>
      </div>

      <AddCustomItemModal
        isOpen={showCustomItemModal}
        onClose={() => setShowCustomItemModal(false)}
      />
    </>
  );
};

export default TopBar;