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

const fromCents = (cents) => ((Number(cents || 0) || 0) / 100).toFixed(2);

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
        ? `${SETTINGS.currency}${(min / 100).toFixed(2)}`
        : `${SETTINGS.currency}${(min / 100).toFixed(2)} - ${SETTINGS.currency}${(
            max / 100
          ).toFixed(2)}`;
    }
    return `${SETTINGS.currency}${(item.price / 100).toFixed(2)}`;
  };

  const styles = {
    container: {
      padding: "40px",
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

    // âœ… Scrollable items panel (hidden scrollbar, last card visible)
    itemsPanel: {
      background: theme.cardBg,
      borderRadius: "16px",
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
      padding: "14px",
      paddingBottom: "28px",           // âœ… last item not cut
      maxHeight: "calc(100vh - 320px)",// âœ… better responsive height
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

    // âœ… smaller grid
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

    // âœ… smaller card
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

    // Edit modal
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
    row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
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
  };

  return (
    <div style={styles.container}>
      {/* hide scrollbar but keep scroll */}
      <style>{`
        .items-scroll-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .items-scroll-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Header */}
      <div>
        <div style={styles.headerTop}>
          <div style={styles.title}>Menu Management</div>

          <button style={styles.addButton} onClick={() => setShowAddModal(true)}>
            <Plus size={20} />
            Add New Item
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.totalItems}</div>
            <div style={styles.statLabel}>Total Items</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.customItems}</div>
            <div style={styles.statLabel}>Custom Items</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.categories}</div>
            <div style={styles.statLabel}>Categories</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.customCategories}</div>
            <div style={styles.statLabel}>Custom Categories</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.searchBox}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search items..."
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          style={styles.select}
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

        <div style={styles.viewToggle}>
          <button
            style={styles.viewButton(viewMode === "grid")}
            onClick={() => setViewMode("grid")}
          >
            <Grid size={16} /> Grid
          </button>
          <button
            style={styles.viewButton(viewMode === "list")}
            onClick={() => setViewMode("list")}
          >
            <ListIcon size={16} /> List
          </button>
        </div>
      </div>

      {/* âœ… Scrollable Items Panel */}
      <div style={styles.itemsPanel} className="items-scroll-hide">
        <div style={styles.itemsPanelTitle}>
          <span>Items</span>
          <span style={styles.itemsCount}>{filteredItems.length} shown</span>
        </div>

        {filteredItems.length === 0 ? (
          <div style={styles.emptyState}>
            <Package style={styles.emptyIcon} />
            <div style={styles.emptyText}>No items found</div>
            <div style={styles.emptySubtext}>
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your filters"
                : "Add your first menu item to get started"}
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div style={styles.gridView}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                style={styles.itemCard}
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
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemCategory}>{item.category}</div>
                </div>

                <div style={styles.itemPrice}>{getPrice(item)}</div>

                <div style={styles.badges}>
                  {item.isCustom ? (
                    <span style={styles.badge(theme.success)}>
                      <CheckCircle size={11} /> CUSTOM
                    </span>
                  ) : (
                    <span style={styles.badge(theme.textSecondary)}>
                      <Package size={11} /> DEFAULT
                    </span>
                  )}

                  {item.hasModifiers && (
                    <span style={styles.badge(theme.textSecondary)}>
                      <AlertTriangle size={11} /> MODIFIERS
                    </span>
                  )}

                  {item.prices && (
                    <span style={styles.badge(theme.success)}>
                      <Layers size={11} /> {Object.keys(item.prices).length} SIZES
                    </span>
                  )}
                </div>

                <div style={styles.actions}>
                  <button style={styles.actionButton("edit")} onClick={() => openEdit(item)}>
                    <Edit2 size={12} /> View / Edit
                  </button>

                  <button
                    style={styles.actionButton("delete")}
                    onClick={() => handleDeleteItem(item)}
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.listView}>
            {filteredItems.map((item) => (
              <div key={item.id} style={styles.listItem}>
                <div>
                  <div style={styles.itemName}>{item.name}</div>
                  {item.description && (
                    <div style={{ fontSize: "13px", color: theme.textSecondary, marginTop: "4px" }}>
                      {item.description}
                    </div>
                  )}
                </div>

                <div style={styles.itemCategory}>{item.category}</div>
                <div style={styles.itemPrice}>{getPrice(item)}</div>

                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
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

      {/* Category Management */}
      <div style={styles.categorySectionWrap}>
        <h2 style={{ fontSize: "18px", fontWeight: "800", color: theme.textPrimary, marginBottom: "12px" }}>
          Category Management
        </h2>

        {allCategories.map((category) => {
          const isCustom =
            !DEFAULT_MENU[category] && !["coffee", "fruittea", "milktea"].includes(category);
          const itemCount = menu[category]?.length || 0;

          return (
            <div key={category} style={{ marginBottom: "12px" }}>
              <div style={styles.categoryHeader}>
                <div style={styles.categoryTitle}>
                  <Package size={18} />
                  {category.toUpperCase()}
                  <span style={{ fontSize: "13px", fontWeight: "700", color: theme.textSecondary }}>
                    ({itemCount} items)
                  </span>
                </div>

                {isCustom && (
                  <button
                    style={{ ...styles.btn("secondary"), background: theme.danger, color: "#fff" }}
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

      {/* Add Item Modal */}
      <AddCustomItemModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

      {/* Edit Modal */}
      {editOpen && editItem && (
        <div style={styles.overlay} onClick={closeEdit}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>View / Edit Item</div>
              <button style={styles.btn("secondary")} onClick={closeEdit}>
                <X size={16} />
                Close
              </button>
            </div>

            <div style={styles.modalBody}>
              <div>
                <div style={styles.label}>Item Name</div>
                <input
                  style={styles.input}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Chicken Sub"
                />
              </div>

              <div>
                <div style={styles.label}>Description</div>
                <textarea
                  style={styles.textarea}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Optional description..."
                />
              </div>

              <div style={styles.row2}>
                <div>
                  <div style={styles.label}>Category</div>
                  <select
                    style={styles.input}
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {!editItem.prices ? (
                  <div>
                    <div style={styles.label}>Price ({SETTINGS.currency})</div>
                    <input
                      style={styles.input}
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      placeholder="e.g. 4.99"
                    />
                  </div>
                ) : (
                  <div>
                    <div style={styles.label}>Sizes & Prices ({SETTINGS.currency})</div>
                    <div style={styles.pricesBox}>
                      {Object.keys(editItem.prices).map((k) => (
                        <div key={k} style={styles.priceRow}>
                          <div style={{ fontWeight: "800", color: theme.textPrimary }}>{k}</div>
                          <input
                            style={styles.input}
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
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.btn("secondary")} onClick={closeEdit}>
                Cancel
              </button>
              <button style={styles.btn("primary")} onClick={handleSaveEdit}>
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