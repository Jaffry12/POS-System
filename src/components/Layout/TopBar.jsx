import { useState } from "react";
import { Search, Eye, ArrowUpDown, Filter, Plus } from "lucide-react";
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
    },
    leftSection: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flex: 1,
    },
    searchContainer: {
      position: "relative",
      flex: 1,
      maxWidth: "400px",
    },
    searchIcon: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: theme.textLight,
    },
    searchInput: {
      width: "100%",
      padding: "10px 12px 10px 40px",
      border: `1px solid ${theme.inputBorder}`,
      borderRadius: "8px",
      background: theme.inputBg,
      color: theme.textPrimary,
      fontSize: "14px",
    },
    actionButton: {
      padding: "10px 16px",
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      background: theme.bgCard,
      color: theme.textSecondary,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s ease",
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
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    orderInfo: {
      textAlign: "right",
    },
    orderNumber: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.textPrimary,
    },
    orderDate: {
      fontSize: "12px",
      color: theme.textSecondary,
    },
  };

  const getCurrentDate = () => {
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    return new Date().toLocaleDateString("en-GB", options);
  };

  return (
    <>
      <div style={styles.topBar}>
        {/* Left Section */}
        <div style={styles.leftSection}>
          {/* Search */}
          <div style={styles.searchContainer}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search Categories or Menu..."
              style={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <button
            style={styles.actionButton}
            onMouseEnter={(e) => (e.currentTarget.style.background = theme.bgHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = theme.bgCard)}
          >
            <Eye size={16} />
          </button>
          <button
            style={styles.actionButton}
            onMouseEnter={(e) => (e.currentTarget.style.background = theme.bgHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = theme.bgCard)}
          >
            <ArrowUpDown size={16} />
          </button>
          <button
            style={styles.actionButton}
            onMouseEnter={(e) => (e.currentTarget.style.background = theme.bgHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = theme.bgCard)}
          >
            <Filter size={16} />
          </button>

          {/* Add New Item Button */}
          <button
            style={styles.addButton}
            onClick={() => setShowCustomItemModal(true)}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <Plus size={18} />
            Add New Item
          </button>
        </div>

        {/* Right Section */}
        <div style={styles.rightSection}>
          <div style={styles.orderInfo}>
            <div style={styles.orderNumber}>Order #{orderNumber}</div>
            <div style={styles.orderDate}>{getCurrentDate()}</div>
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
