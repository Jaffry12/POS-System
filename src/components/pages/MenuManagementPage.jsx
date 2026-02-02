import { useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import { SETTINGS, DEFAULT_MENU } from "../../data/menuData";
import AddCustomItemModal from "../Order/AddCustomItemModal";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  Grid,
  List as ListIcon,
  CheckCircle,
  AlertTriangle,
  Layers,
  X,
} from "lucide-react";

const toCents = (val) => {
  const n = Number(val);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
};

const fromCents = (cents) => {
  const value = (Number(cents || 0) || 0) / 100;
  // Remove trailing zeros: 9.90 -> 9.9, 5.00 -> 5
  return value % 1 === 0 ? value.toString() : value.toFixed(2).replace(/\.?0+$/, '');
};

const formatPriceDisplay = (cents) => {
  const value = cents / 100;
  if (value % 1 === 0) return value.toString();
  return value.toFixed(2).replace(/\.?0+$/, '');
};

const MenuManagementPage = () => {
  const { theme } = useTheme();
  const { menu, deleteMenuItem, deleteCategory, updateMenuItem } = usePOS();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editPrices, setEditPrices] = useState({});

  const allCategories = Object.keys(menu);

  const allItems = useMemo(() => {
    let items = [];
    Object.entries(menu).forEach(([category, categoryItems]) => {
      items = [...items, ...categoryItems.map((item) => ({ ...item, category }))];
    });
    return items;
  }, [menu]);

  const filteredItems = useMemo(() => {
    let items = allItems;

    if (selectedCategory !== "all") {
      items = items.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    return items;
  }, [allItems, selectedCategory, searchQuery]);

  const stats = useMemo(() => {
    const totalItems = allItems.length;
    const customItems = allItems.filter((item) => item.isCustom).length;
    const categories = allCategories.length;
    const customCategories = allCategories.filter((cat) => !DEFAULT_MENU[cat]).length;
    return { totalItems, customItems, categories, customCategories };
  }, [allItems, allCategories]);

  const openEdit = (item) => {
    setEditItem(item);
    setEditName(item.name || "");
    setEditDesc(item.description || "");
    setEditCategory(item.category || "");

    if (item.prices) {
      const next = {};
      Object.entries(item.prices).forEach(([k, v]) => {
        next[k] = fromCents(v);
      });
      setEditPrices(next);
      setEditPrice("");
    } else {
      setEditPrice(fromCents(item.price));
      setEditPrices({});
    }

    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditItem(null);
  };

  const handleSaveEdit = () => {
    if (!editItem) return;

    if (!editName.trim()) {
      alert("Item name is required.");
      return;
    }

    const updated = {
      ...editItem,
      name: editName.trim(),
      description: editDesc.trim(),
      category: editCategory || editItem.category,
      isCustom: true,
    };

    if (editItem.prices) {
      const nextPrices = {};
      Object.keys(editItem.prices).forEach((k) => {
        nextPrices[k] = toCents(editPrices[k]);
      });
      updated.prices = nextPrices;
      delete updated.price;
    } else {
      updated.price = toCents(editPrice);
      delete updated.prices;
    }

    updateMenuItem(updated, editItem.category);
    closeEdit();
  };

  const handleDeleteItem = (item) => {
    const msg = `Delete "${item.name}" permanently? This will remove it from Home page as well.`;
    if (!window.confirm(msg)) return;
    deleteMenuItem(item.id, item.category);
  };

  const handleDeleteCategory = (category) => {
    const itemCount = menu[category]?.length || 0;
    const msg = `Delete category "${category}" and all ${itemCount} items permanently?`;
    if (!window.confirm(msg)) return;
    deleteCategory(category);
  };

  const getPrice = (item) => {
    if (item.prices) {
      const prices = Object.values(item.prices);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return min === max
        ? `${SETTINGS.currency}${formatPriceDisplay(min)}`
        : `${SETTINGS.currency}${formatPriceDisplay(min)} - ${SETTINGS.currency}${formatPriceDisplay(max)}`;
    }
    return `${SETTINGS.currency}${formatPriceDisplay(item.price)}`;
  };

  const styles = {
    container: {
      padding: "40px",
      paddingBottom: "180px",
      background: theme.bgPrimary,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    },
    headerTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "700",
      color: theme.textPrimary,
    },
    addButton: {
      padding: "12px 24px",
      background: theme.success,
      color: "#FFFFFF",
      border: "none",
      borderRadius: "10px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    statsRow: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
    },
    statCard: {
      background: theme.cardBg,
      padding: "18px",
      borderRadius: "12px",
      boxShadow: theme.shadow,
    },
    statValue: {
      fontSize: "28px",
      fontWeight: "800",
      color: theme.success,
      marginBottom: "4px",
    },
    statLabel: {
      fontSize: "13px",
      color: theme.textSecondary,
    },
    controls: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      alignItems: "center",
    },
    searchBox: {
      flex: 1,
      minWidth: "250px",
      position: "relative",
    },
    searchInput: {
      width: "100%",
      padding: "12px 12px 12px 40px",
      border: `1px solid ${theme.border}`,
      borderRadius: "10px",
      background: theme.cardBg,
      color: theme.textPrimary,
      fontSize: "14px",
      outline: "none",
    },
    searchIcon: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: theme.textSecondary,
    },
    select: {
      padding: "12px 14px",
      border: `1px solid ${theme.border}`,
      borderRadius: "10px",
      background: theme.cardBg,
      color: theme.textPrimary,
      fontSize: "14px",
      cursor: "pointer",
      outline: "none",
      minWidth: "170px",
    },
    viewToggle: {
      display: "flex",
      gap: "4px",
      background: theme.bgSecondary,
      padding: "4px",
      borderRadius: "8px",
    },
    viewButton: (active) => ({
      padding: "8px 12px",
      border: "none",
      background: active ? theme.cardBg : "transparent",
      color: active ? theme.textPrimary : theme.textSecondary,
      borderRadius: "6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      fontWeight: "700",
    }),
    itemsPanel: {
      background: theme.cardBg,
      borderRadius: "16px",
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
      padding: "14px",
      paddingBottom: "40px",
      maxHeight: "calc(100vh - 320px)",
      overflowY: "auto",
    },
    itemsPanelTitle: {
      fontSize: "15px",
      fontWeight: "800",
      color: theme.textPrimary,
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    itemsCount: {
      fontSize: "12px",
      color: theme.textSecondary,
      fontWeight: "700",
    },
    gridView: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      gap: "14px",
    },
    listView: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    itemCard: {
      background: theme.bgSecondary,
      borderRadius: "12px",
      padding: "14px",
      boxShadow: theme.shadow,
      border: `2px solid ${theme.border}`,
      transition: "all 0.2s ease",
    },
    itemName: {
      fontSize: "14px",
      fontWeight: "800",
      color: theme.textPrimary,
      marginBottom: "4px",
    },
    itemCategory: {
      fontSize: "11px",
      color: theme.textSecondary,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    itemPrice: {
      fontSize: "16px",
      fontWeight: "900",
      color: theme.success,
      marginTop: "10px",
      marginBottom: "10px",
    },
    badges: {
      display: "flex",
      gap: "8px",
      marginBottom: "8px",
      flexWrap: "wrap",
    },
    badge: (color) => ({
      padding: "3px 7px",
      borderRadius: "6px",
      fontSize: "10px",
      fontWeight: "800",
      background: `${color}20`,
      color,
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    }),
    actions: {
      display: "flex",
      gap: "10px",
      marginTop: "10px",
    },
    actionButton: (variant) => ({
      flex: 1,
      padding: "8px 10px",
      border: "none",
      borderRadius: "10px",
      background: variant === "delete" ? theme.danger : theme.success,
      color: "#FFFFFF",
      fontSize: "12px",
      fontWeight: "800",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    }),
    listItem: {
      background: theme.bgSecondary,
      borderRadius: "12px",
      padding: "12px 14px",
      boxShadow: theme.shadow,
      border: `2px solid ${theme.border}`,
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 170px",
      gap: "12px",
      alignItems: "center",
    },
    emptyState: {
      textAlign: "center",
      padding: "44px 18px",
      background: theme.bgSecondary,
      borderRadius: "16px",
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
    },
    emptyIcon: {
      width: "58px",
      height: "58px",
      margin: "0 auto 14px",
      color: theme.textLight,
    },
    emptyText: {
      fontSize: "16px",
      color: theme.textSecondary,
      marginBottom: "6px",
      fontWeight: "800",
    },
    emptySubtext: {
      fontSize: "13px",
      color: theme.textLight,
    },
    categorySectionWrap: {
      marginTop: "6px",
      background: theme.cardBg,
      borderRadius: "16px",
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
      padding: "18px",
    },
    categoryHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 16px",
      background: theme.bgSecondary,
      borderRadius: "12px",
      marginBottom: "12px",
    },
    categoryTitle: {
      fontSize: "16px",
      fontWeight: "800",
      color: theme.textPrimary,
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.65)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: "20px",
    },
    modal: {
      width: "760px",
      maxWidth: "95vw",
      background: theme.cardBg,
      borderRadius: "16px",
      boxShadow: theme.shadowLarge,
      border: `1px solid ${theme.border}`,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    modalHeader: {
      padding: "16px 18px",
      borderBottom: `1px solid ${theme.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    modalTitle: {
      fontSize: "18px",
      fontWeight: "800",
      color: theme.textPrimary,
    },
    modalBody: {
      padding: "18px",
      display: "grid",
      gap: "12px",
      maxHeight: "70vh",
      overflowY: "auto",
    },
    label: {
      fontSize: "13px",
      fontWeight: "700",
      color: theme.textSecondary,
      marginBottom: "6px",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: `1px solid ${theme.border}`,
      background: theme.bgSecondary,
      color: theme.textPrimary,
      outline: "none",
    },
    textarea: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: `1px solid ${theme.border}`,
      background: theme.bgSecondary,
      color: theme.textPrimary,
      outline: "none",
      minHeight: "100px",
      resize: "vertical",
    },
    pricesBox: {
      background: theme.bgSecondary,
      border: `1px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "12px",
      display: "grid",
      gap: "10px",
    },
    priceRow: {
      display: "grid",
      gridTemplateColumns: "140px 1fr",
      gap: "10px",
      alignItems: "center",
    },
    modalFooter: {
      padding: "16px 18px",
      borderTop: `1px solid ${theme.border}`,
      display: "flex",
      gap: "10px",
      justifyContent: "flex-end",
    },
    btn: (variant) => ({
      padding: "10px 14px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      fontWeight: "800",
      background: variant === "primary" ? theme.success : theme.bgSecondary,
      color: variant === "primary" ? "#fff" : theme.textPrimary,
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
    }),
    categoryBadge: {
      padding: "6px 12px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: "800",
      background: theme.bgSecondary,
      color: theme.textPrimary,
      border: `2px solid ${theme.border}`,
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
    },
  };

  return (
    <div style={styles.container} className="menu-container">
      <style>{`
        .items-scroll-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .items-scroll-hide::-webkit-scrollbar {
          display: none;
        }

        /* Tablet: 768px - 1024px */
        @media (max-width: 1024px) and (min-width: 768px) {
          .menu-container {
            padding: 32px !important;
            padding-bottom: 160px !important;
            gap: 16px !important;
          }
          .menu-header-top {
            margin-bottom: 14px !important;
          }
          .menu-title {
            font-size: 28px !important;
          }
          .menu-add-btn {
            padding: 10px 20px !important;
            font-size: 14px !important;
          }
          .menu-stats {
            gap: 14px !important;
          }
          .menu-stat-card {
            padding: 16px !important;
          }
          .menu-stat-value {
            font-size: 24px !important;
          }
          .menu-controls {
            gap: 10px !important;
          }
          .menu-items-panel {
            padding: 12px !important;
            padding-bottom: 60px !important;
          }
          .menu-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
            gap: 12px !important;
          }
        }

        /* Mobile: 480px - 768px */
        @media (max-width: 768px) {
          .menu-container {
            padding: 20px !important;
            padding-bottom: 100px !important;
            gap: 14px !important;
          }
          .menu-header-top {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
            margin-bottom: 12px !important;
          }
          .menu-title {
            font-size: 24px !important;
          }
          .menu-add-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 12px !important;
          }
          .menu-stats {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .menu-stat-card {
            padding: 14px !important;
          }
          .menu-stat-value {
            font-size: 22px !important;
          }
          .menu-stat-label {
            font-size: 12px !important;
          }
          .menu-controls {
            flex-direction: column !important;
            gap: 10px !important;
          }
          .menu-search-box {
            width: 100% !important;
            min-width: 0 !important;
          }
          .menu-select {
            width: 100% !important;
            min-width: 0 !important;
          }
          .menu-view-toggle {
            width: 100% !important;
          }
          .menu-view-btn {
            flex: 1 !important;
            justify-content: center !important;
          }
          .menu-items-panel {
            padding: 12px !important;
            padding-bottom: 80px !important;
            max-height: calc(100vh - 450px) !important;
          }
          .menu-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .menu-list {
            gap: 10px !important;
          }
          .menu-list-item {
            grid-template-columns: 1fr !important;
            padding: 12px !important;
            gap: 10px !important;
          }
          .menu-list-actions {
            width: 100% !important;
            justify-content: stretch !important;
          }
          .menu-list-actions button {
            flex: 1 !important;
          }
          .menu-category-section {
            padding: 14px !important;
          }
          .menu-category-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
            padding: 12px !important;
          }
          .menu-category-delete {
            width: 100% !important;
          }
          .menu-modal {
            width: 95vw !important;
            max-height: 90vh !important;
          }
          .menu-modal-body {
            padding: 14px !important;
            max-height: 60vh !important;
          }
        }

        /* Small Mobile: < 480px */
        @media (max-width: 480px) {
          .menu-container {
            padding: 16px !important;
            padding-bottom: 100px !important;
            gap: 12px !important;
          }
          .menu-title {
            font-size: 22px !important;
          }
          .menu-add-btn {
            padding: 10px !important;
            font-size: 13px !important;
          }
          .menu-stats {
            gap: 10px !important;
          }
          .menu-stat-card {
            padding: 12px !important;
          }
          .menu-stat-value {
            font-size: 20px !important;
          }
          .menu-stat-label {
            font-size: 11px !important;
          }
          .menu-controls {
            gap: 8px !important;
          }
          .menu-search-input {
            padding: 10px 10px 10px 36px !important;
            font-size: 13px !important;
          }
          .menu-select {
            padding: 10px 12px !important;
            font-size: 13px !important;
          }
          .menu-view-btn {
            padding: 8px 10px !important;
            font-size: 12px !important;
          }
          .menu-items-panel {
            padding: 10px !important;
            padding-bottom: 80px !important;
          }
          .menu-panel-title {
            font-size: 14px !important;
            margin-bottom: 10px !important;
          }
          .menu-items-count {
            font-size: 11px !important;
          }
          .menu-grid {
            gap: 10px !important;
          }
          .menu-card {
            padding: 12px !important;
          }
          .menu-item-name {
            font-size: 13px !important;
          }
          .menu-item-category {
            font-size: 10px !important;
          }
          .menu-item-price {
            font-size: 14px !important;
            margin-top: 8px !important;
            margin-bottom: 8px !important;
          }
          .menu-badges {
            gap: 6px !important;
            margin-bottom: 6px !important;
          }
          .menu-badge {
            font-size: 9px !important;
            padding: 2px 6px !important;
          }
          .menu-actions {
            gap: 8px !important;
            margin-top: 8px !important;
          }
          .menu-action-btn {
            padding: 8px !important;
            font-size: 11px !important;
          }
          .menu-list-item {
            padding: 10px !important;
          }
          .menu-empty {
            padding: 32px 14px !important;
          }
          .menu-empty-icon {
            width: 48px !important;
            height: 48px !important;
            margin-bottom: 12px !important;
          }
          .menu-empty-text {
            font-size: 14px !important;
          }
          .menu-empty-subtext {
            font-size: 12px !important;
          }
          .menu-category-section {
            padding: 12px !important;
          }
          .menu-category-title {
            font-size: 16px !important;
            margin-bottom: 10px !important;
          }
          .menu-category-header {
            padding: 10px !important;
          }
          .menu-category-name {
            font-size: 14px !important;
          }
          .menu-modal-header {
            padding: 12px 14px !important;
          }
          .menu-modal-title {
            font-size: 16px !important;
          }
          .menu-modal-body {
            padding: 12px !important;
            gap: 10px !important;
          }
          .menu-modal-label {
            font-size: 12px !important;
          }
          .menu-modal-input {
            padding: 10px !important;
            font-size: 13px !important;
          }
          .menu-modal-footer {
            padding: 12px 14px !important;
            gap: 8px !important;
          }
          .menu-modal-btn {
            padding: 10px 12px !important;
            font-size: 13px !important;
          }
        }
      `}</style>

      <div>
        <div style={styles.headerTop} className="menu-header-top">
          <div style={styles.title} className="menu-title">Menu Management</div>

          <button style={styles.addButton} className="menu-add-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={20} />
            Add New Item
          </button>
        </div>

        <div style={styles.statsRow} className="menu-stats">
          <div style={styles.statCard} className="menu-stat-card">
            <div style={styles.statValue} className="menu-stat-value">{stats.totalItems}</div>
            <div style={styles.statLabel} className="menu-stat-label">Total Items</div>
          </div>
          <div style={styles.statCard} className="menu-stat-card">
            <div style={styles.statValue} className="menu-stat-value">{stats.customItems}</div>
            <div style={styles.statLabel} className="menu-stat-label">Custom Items</div>
          </div>
          <div style={styles.statCard} className="menu-stat-card">
            <div style={styles.statValue} className="menu-stat-value">{stats.categories}</div>
            <div style={styles.statLabel} className="menu-stat-label">Categories</div>
          </div>
          <div style={styles.statCard} className="menu-stat-card">
            <div style={styles.statValue} className="menu-stat-value">{stats.customCategories}</div>
            <div style={styles.statLabel} className="menu-stat-label">Custom Categories</div>
          </div>
        </div>
      </div>

      <div style={styles.controls} className="menu-controls">
        <div style={styles.searchBox} className="menu-search-box">
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search items..."
            style={styles.searchInput}
            className="menu-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          style={styles.select}
          className="menu-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <div style={styles.viewToggle} className="menu-view-toggle">
          <button
            style={styles.viewButton(viewMode === "grid")}
            className="menu-view-btn"
            onClick={() => setViewMode("grid")}
          >
            <Grid size={16} /> Grid
          </button>
          <button
            style={styles.viewButton(viewMode === "list")}
            className="menu-view-btn"
            onClick={() => setViewMode("list")}
          >
            <ListIcon size={16} /> List
          </button>
        </div>
      </div>

      <div style={styles.itemsPanel} className="items-scroll-hide menu-items-panel">
        <div style={styles.itemsPanelTitle} className="menu-panel-title">
          <span>Items</span>
          <span style={styles.itemsCount} className="menu-items-count">{filteredItems.length} shown</span>
        </div>

        {filteredItems.length === 0 ? (
          <div style={styles.emptyState} className="menu-empty">
            <Package style={styles.emptyIcon} className="menu-empty-icon" />
            <div style={styles.emptyText} className="menu-empty-text">No items found</div>
            <div style={styles.emptySubtext} className="menu-empty-subtext">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your filters"
                : "Add your first menu item to get started"}
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div style={styles.gridView} className="menu-grid">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                style={styles.itemCard}
                className="menu-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.success;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = theme.shadowMedium;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = theme.shadow;
                }}
              >
                <div>
                  <div style={styles.itemName} className="menu-item-name">{item.name}</div>
                  <div style={styles.itemCategory} className="menu-item-category">{item.category}</div>
                </div>

                <div style={styles.itemPrice} className="menu-item-price">{getPrice(item)}</div>

                <div style={styles.badges} className="menu-badges">
                  {item.isCustom ? (
                    <span style={styles.badge(theme.success)} className="menu-badge">
                      <CheckCircle size={11} /> CUSTOM
                    </span>
                  ) : (
                    <span style={styles.badge(theme.textSecondary)} className="menu-badge">
                      <Package size={11} /> DEFAULT
                    </span>
                  )}

                  {item.hasModifiers && (
                    <span style={styles.badge(theme.textSecondary)} className="menu-badge">
                      <AlertTriangle size={11} /> MODIFIERS
                    </span>
                  )}

                  {item.prices && (
                    <span style={styles.badge(theme.success)} className="menu-badge">
                      <Layers size={11} /> {Object.keys(item.prices).length} SIZES
                    </span>
                  )}
                </div>

                <div style={styles.actions} className="menu-actions">
                  <button style={styles.actionButton("edit")} className="menu-action-btn" onClick={() => openEdit(item)}>
                    <Edit2 size={12} /> View / Edit
                  </button>

                  <button
                    style={styles.actionButton("delete")}
                    className="menu-action-btn"
                    onClick={() => handleDeleteItem(item)}
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.listView} className="menu-list">
            {filteredItems.map((item) => (
              <div key={item.id} style={styles.listItem} className="menu-list-item">
                <div>
                  <div style={styles.itemName} className="menu-item-name">{item.name}</div>
                  {item.description && (
                    <div style={{ fontSize: "13px", color: theme.textSecondary, marginTop: "4px" }}>
                      {item.description}
                    </div>
                  )}
                </div>

                <div style={styles.itemCategory} className="menu-item-category">{item.category}</div>
                <div style={styles.itemPrice} className="menu-item-price">{getPrice(item)}</div>

                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }} className="menu-list-actions">
                  <button style={styles.btn("primary")} onClick={() => openEdit(item)}>
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    style={{ ...styles.btn("secondary"), background: theme.danger, color: "#fff" }}
                    onClick={() => handleDeleteItem(item)}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.categorySectionWrap} className="menu-category-section">
        <h2 style={{ fontSize: "18px", fontWeight: "800", color: theme.textPrimary, marginBottom: "12px" }} className="menu-category-title">
          Category Management
        </h2>

        {allCategories.map((category) => {
          const isCustom =
            !DEFAULT_MENU[category] && !["coffee", "fruittea", "milktea"].includes(category);
          const itemCount = menu[category]?.length || 0;

          return (
            <div key={category} style={{ marginBottom: "12px" }}>
              <div style={styles.categoryHeader} className="menu-category-header">
                <div style={styles.categoryTitle} className="menu-category-name">
                  <Package size={18} />
                  {category.toUpperCase()}
                  <span style={{ fontSize: "13px", fontWeight: "700", color: theme.textSecondary }}>
                    ({itemCount} items)
                  </span>
                </div>

                {isCustom && (
                  <button
                    style={{ ...styles.btn("secondary"), background: theme.danger, color: "#fff" }}
                    className="menu-category-delete"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <Trash2 size={14} />
                    Delete Category
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AddCustomItemModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

      {editOpen && editItem && (
        <div style={styles.overlay} onClick={closeEdit}>
          <div style={styles.modal} className="menu-modal" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader} className="menu-modal-header">
              <div style={styles.modalTitle} className="menu-modal-title">View / Edit Item</div>
              <button style={styles.btn("secondary")} onClick={closeEdit}>
                <X size={16} />
                Close
              </button>
            </div>

            <div style={styles.modalBody} className="menu-modal-body">
              <div>
                <div style={styles.label} className="menu-modal-label">Item Name</div>
                <input
                  style={styles.input}
                  className="menu-modal-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Chicken Sub"
                />
              </div>

              <div>
                <div style={styles.label} className="menu-modal-label">Category</div>
                <div style={styles.categoryBadge}>
                  <Package size={14} />
                  {editCategory.toUpperCase()}
                </div>
              </div>

              {!editItem.prices ? (
                <div>
                  <div style={styles.label} className="menu-modal-label">Price ({SETTINGS.currency})</div>
                  <input
                    style={styles.input}
                    className="menu-modal-input"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="e.g. 4.99"
                  />
                </div>
              ) : (
                <div>
                  <div style={styles.label} className="menu-modal-label">Sizes & Prices ({SETTINGS.currency})</div>
                  <div style={styles.pricesBox}>
                    {Object.keys(editItem.prices).map((k) => (
                      <div key={k} style={styles.priceRow}>
                        <div style={{ fontWeight: "800", color: theme.textPrimary }}>{k}</div>
                        <input
                          style={styles.input}
                          className="menu-modal-input"
                          value={editPrices[k] ?? ""}
                          onChange={(e) =>
                            setEditPrices((p) => ({ ...p, [k]: e.target.value }))
                          }
                          placeholder="e.g. 3.50"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div style={styles.label} className="menu-modal-label">Description</div>
                <textarea
                  style={styles.textarea}
                  className="menu-modal-input"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Optional description..."
                />
              </div>
            </div>

            <div style={styles.modalFooter} className="menu-modal-footer">
              <button style={styles.btn("secondary")} className="menu-modal-btn" onClick={closeEdit}>
                Cancel
              </button>
              <button style={styles.btn("primary")} className="menu-modal-btn" onClick={handleSaveEdit}>
                <CheckCircle size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagementPage;