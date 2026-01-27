import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import AddCustomItemModal from "../Order/AddCustomItemModal";

const TopBar = () => {
  const { theme } = useTheme();
  const { searchQuery, setSearchQuery, orderNumber } = usePOS();
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
    addButton: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "8px",
      background: theme.success,
      color: "#FFFFFF",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "14px",
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
        /* Desktop (default - unchanged) */
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

        .topbar-add-button {
          padding: 10px 20px;
        }

        .topbar-add-button-text {
          display: inline;
        }

        .topbar-order-date {
          display: block;
        }

        /* Tablet: Adjust spacing */
        @media (max-width: 1024px) {
          .topbar-responsive {
            padding: 14px 20px !important;
          }
          
          .topbar-search-container {
            max-width: 350px !important;
          }
        }

        /* Mobile: Compact layout with small plus button */
        @media (max-width: 768px) {
          .topbar-responsive {
            padding: 12px 16px 12px 70px !important;
            gap: 10px !important;
            flex-wrap: nowrap !important;
          }
          
          .topbar-left-section {
            flex: 1 !important;
            min-width: 0 !important;
            gap: 10px !important;
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
          }
          
          /* Small square plus button - same size as hamburger */
          .topbar-add-button {
            width: 48px !important;
            height: 48px !important;
            min-width: 48px !important;
            padding: 0 !important;
            border-radius: 12px !important;
            justify-content: center !important;
            flex-shrink: 0 !important;
          }
          
          .topbar-add-button-text {
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
            gap: 8px !important;
          }
          
          .topbar-left-section {
            gap: 8px !important;
          }
          
          /* Smaller square button on very small screens */
          .topbar-add-button {
            width: 44px !important;
            height: 44px !important;
            min-width: 44px !important;
            border-radius: 10px !important;
          }
          
          .topbar-search-container input {
            font-size: 13px !important;
            padding: 9px 10px 9px 34px !important;
          }
          
          .topbar-search-icon {
            left: 10px !important;
          }
        }
      `}</style>

      <div className="topbar-responsive" style={styles.topBar}>
        {/* Left Section - Search + Plus Button */}
        <div className="topbar-left-section" style={styles.leftSection}>
          {/* Search */}
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

          {/* Add New Item Button */}
          <button
            className="topbar-add-button"
            style={styles.addButton}
            onClick={() => setShowCustomItemModal(true)}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <Plus size={20} />
            <span className="topbar-add-button-text">Add New Item</span>
          </button>
        </div>

        {/* Right Section - Order Info (Hidden on mobile) */}
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

      {/* Custom Item Modal */}
      <AddCustomItemModal
        isOpen={showCustomItemModal}
        onClose={() => setShowCustomItemModal(false)}
      />
    </>
  );
};

export default TopBar;