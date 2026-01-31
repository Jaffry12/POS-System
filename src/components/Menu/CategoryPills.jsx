import * as Icons from "lucide-react";
import { Package, ChevronLeft, Home } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import { CATEGORIES, DEFAULT_MENU } from "../../data/menuData";

// ✅ Categories that should ALWAYS show in home page
const DEFAULT_CATEGORIES = ["subs", "drinks", "hots", "saladrolls"];

// ✅ Map subcategory -> parent
const SUB_TO_PARENT = {
  coffee: "drinks",
  fruittea: "drinks",
  milktea: "drinks",
};

// ✅ Friendly names for breadcrumb
const LABELS = {
  subs: "SUBS",
  drinks: "DRINKS",
  hots: "HOTS",
  saladrolls: "SALAD ROLLS",
  coffee: "VIETNAMESE ICED COFFEE",
  fruittea: "FRUIT TEA",
  milktea: "MILK TEA",
};

const CategoryPills = () => {
  const { theme } = useTheme();
  const { activeCategory, setActiveCategory, menu } = usePOS();

  // ✅ Categories that have items in menu
  const menuCategories = Object.keys(menu || {}).filter(
    (cat) => (menu?.[cat] || []).length > 0
  );

  // ✅ Always include default categories even if they have 0 items
  const allCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...menuCategories]));

  // Check which categories are custom (not in DEFAULT_MENU)
  const isCustomCategory = (categoryId) => {
    return (
      !DEFAULT_MENU?.[categoryId] &&
      !["coffee", "fruittea", "milktea"].includes(categoryId) &&
      !DEFAULT_CATEGORIES.includes(categoryId)
    );
  };

  // Determine main categories
  const mainCategories = allCategories.filter((cat) => {
    if (DEFAULT_CATEGORIES.includes(cat)) return true;
    if (["coffee", "fruittea", "milktea"].includes(cat)) return false;
    return true;
  });

  // Get drink subcategories that exist in menu
  const drinkSubcategories =
    CATEGORIES?.drinks?.filter((sub) => allCategories.includes(sub.id)) || [];

  // Get custom drink subcategories
  const customDrinkCategories = menuCategories.filter((cat) => {
    const item = menu?.[cat]?.[0];
    return (
      item?.parentCategory === "drinks" &&
      !["coffee", "fruittea", "milktea"].includes(cat)
    );
  });

  // ✅ Is home?
  const isHome = !activeCategory;

  // ✅ detect if current activeCategory is a subcategory of any parent
  const isSubcategory =
    ["coffee", "fruittea", "milktea"].includes(activeCategory) ||
    (menuCategories.includes(activeCategory) && menu?.[activeCategory]?.[0]?.parentCategory);

  const parentCategory = isHome
    ? null
    : isSubcategory
    ? menu?.[activeCategory]?.[0]?.parentCategory || SUB_TO_PARENT[activeCategory] || null
    : activeCategory;

  const subCategory = isHome ? null : isSubcategory ? activeCategory : null;

  // ✅ Drinks active highlight
  const isDrinksActive = parentCategory === "drinks";

  // ✅ show subcategory pills only when user is on DRINKS or a DRINK subcategory
  const showDrinkSubs = activeCategory === "drinks" || isDrinksActive;

  const styles = {
    container: {
      padding: "20px 24px",
      background: theme.cardBg,
      borderBottom: `1px solid ${theme.border}`,
    },
    topRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      marginBottom: "10px",
      flexWrap: "wrap",
    },
    leftTop: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap",
    },
    backBtn: {
      border: `1px solid ${theme.border}`,
      background: theme.bgSecondary,
      color: theme.textPrimary,
      padding: "8px 12px",
      borderRadius: "10px",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "13px",
      fontWeight: "700",
      transition: "all 0.2s ease",
      flexShrink: 0,
    },
    breadcrumb: {
      fontSize: "13px",
      fontWeight: "700",
      color: theme.textSecondary,
      display: "flex",
      alignItems: "center",
      gap: "6px",
      flexWrap: "wrap",
      userSelect: "none",
    },
    crumbStrong: {
      color: theme.textPrimary,
      fontWeight: "800",
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: theme.textSecondary,
      marginBottom: "12px",
    },
    pillsContainer: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    },
    pill: (isActive) => ({
      padding: "12px 24px",
      borderRadius: "8px",
      border: "none",
      background: isActive ? theme.primary : theme.bgSecondary,
      color: isActive ? "#FFFFFF" : theme.textPrimary,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.2s ease",
      textTransform: "uppercase",
      position: "relative",
      flexShrink: 0,
      whiteSpace: "nowrap",
    }),
    subCategoriesRow: {
      marginTop: "12px",
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    },
    subPill: (isActive) => ({
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      background: isActive ? theme.primary : theme.bgHover,
      color: isActive ? "#FFFFFF" : theme.textSecondary,
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "600",
      transition: "all 0.2s ease",
      flexShrink: 0,
      whiteSpace: "nowrap",
      textTransform: "uppercase",
    }),
  };

  const formatCategoryName = (category) => {
    if (!category) return "HOME";
    if (LABELS[category]) return LABELS[category];
    if (category === "saladrolls") return "SALAD ROLLS";
    return String(category).replace(/_/g, " ").toUpperCase();
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "subs":
        return Icons.Sandwich;
      case "drinks":
        return Icons.Coffee;
      case "hots":
        return Icons.Flame;
      case "saladrolls":
        return Icons.Salad;
      default:
        return Package;
    }
  };

  // ✅ MAIN category click (NO AUTO SUBCATEGORY)
  const handleMainCategoryClick = (category) => {
    setActiveCategory(category);
  };

  // ✅ Back behavior:
  // - If inside subcategory => back to parent category (drinks)
  // - Else => back to Home
  const handleBack = () => {
    if (subCategory && parentCategory) {
      setActiveCategory(parentCategory);
    } else {
      setActiveCategory(null);
    }
  };

  return (
    <>
      <style>{`
        .category-pills-container { padding: 20px 24px; }
        .category-pills-wrapper { display: flex; flex-wrap: wrap; gap: 8px; }
        .category-sub-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }

        .category-pills-wrapper::-webkit-scrollbar,
        .category-sub-pills::-webkit-scrollbar { display: none; }

        @media (max-width: 1024px) {
          .category-pills-container { padding: 16px 20px !important; }
        }

        @media (max-width: 768px) {
          .category-pills-container { padding: 14px 16px !important; }
          .category-pills-wrapper {
            flex-wrap: nowrap !important;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding-bottom: 4px;
          }
          .category-sub-pills {
            flex-wrap: nowrap !important;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding-bottom: 4px;
          }
          .category-pill-mobile { padding: 10px 20px !important; font-size: 13px !important; }
          .category-sub-pill-mobile { padding: 8px 16px !important; font-size: 12px !important; }
          .category-label-mobile { font-size: 13px !important; }
          .category-top-row { gap: 10px !important; }
          .category-back-btn { padding: 7px 10px !important; font-size: 12px !important; }
          .category-breadcrumb { font-size: 12px !important; }
        }

        @media (max-width: 480px) {
          .category-pills-container { padding: 12px !important; }
          .category-pill-mobile { padding: 8px 16px !important; font-size: 12px !important; }
          .category-sub-pill-mobile { padding: 7px 14px !important; font-size: 11px !important; }
          .category-pill-icon { width: 16px !important; height: 16px !important; }
          .category-back-btn svg { width: 16px !important; height: 16px !important; }
        }
      `}</style>

      <div className="category-pills-container" style={styles.container}>
        {/* ✅ TOP: Back + Breadcrumb */}
        <div className="category-top-row" style={styles.topRow}>
          <div style={styles.leftTop}>
            {!isHome && (
              <button
                className="category-back-btn"
                style={styles.backBtn}
                onClick={handleBack}
                onMouseEnter={(e) => (e.currentTarget.style.background = theme.bgHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = theme.bgSecondary)}
              >
                <ChevronLeft size={18} />
                Back
              </button>
            )}

            <div className="category-breadcrumb" style={styles.breadcrumb}>
              <Home size={16} />
              <span style={styles.crumbStrong}>Home</span>

              {/* ✅ Home / Category */}
              {parentCategory && (
                <>
                  <span style={{ opacity: 0.7 }}>/</span>
                  <span style={styles.crumbStrong}>{formatCategoryName(parentCategory)}</span>
                </>
              )}

              {/* ✅ Home / Category / Subcategory */}
              {subCategory && (
                <>
                  <span style={{ opacity: 0.7 }}>/</span>
                  <span style={styles.crumbStrong}>{formatCategoryName(subCategory)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="category-label-mobile" style={styles.label}>
          {isHome ? "Choose Category" : "Categories"}
        </div>

        {/* Main Categories */}
        <div className="category-pills-wrapper" style={styles.pillsContainer}>
          {mainCategories
            .filter((cat) => !isCustomCategory(cat))
            .map((category) => {
              const isActive =
                parentCategory === category ||
                (category === "drinks" && (activeCategory === "drinks" || isDrinksActive));

              const Icon = getCategoryIcon(category);

              return (
                <button
                  key={category}
                  className="category-pill-mobile"
                  style={styles.pill(isActive)}
                  onClick={() => handleMainCategoryClick(category)}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = theme.bgHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = theme.bgSecondary;
                  }}
                >
                  <Icon className="category-pill-icon" size={18} />
                  {formatCategoryName(category)}
                </button>
              );
            })}

          {/* Custom Categories */}
          {mainCategories
            .filter((cat) => isCustomCategory(cat))
            .map((category) => {
              const isActive = parentCategory === category;

              return (
                <button
                  key={category}
                  className="category-pill-mobile"
                  style={styles.pill(isActive)}
                  onClick={() => setActiveCategory(category)}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = theme.bgHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = theme.bgSecondary;
                  }}
                >
                  <Package className="category-pill-icon" size={18} />
                  {formatCategoryName(category)}
                </button>
              );
            })}
        </div>

        {/* Drink Subcategories */}
        {showDrinkSubs && (drinkSubcategories.length > 0 || customDrinkCategories.length > 0) && (
          <div className="category-sub-pills" style={styles.subCategoriesRow}>
            {drinkSubcategories.map((sub) => {
              const isActive = subCategory === sub.id;

              return (
                <button
                  key={sub.id}
                  className="category-sub-pill-mobile"
                  style={styles.subPill(isActive)}
                  onClick={() => setActiveCategory(sub.id)}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = theme.bgSecondary;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = theme.bgHover;
                  }}
                >
                  {formatCategoryName(sub.id)}
                </button>
              );
            })}

            {customDrinkCategories.map((category) => {
              const isActive = subCategory === category;

              return (
                <button
                  key={category}
                  className="category-sub-pill-mobile"
                  style={styles.subPill(isActive)}
                  onClick={() => setActiveCategory(category)}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = theme.bgSecondary;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = theme.bgHover;
                  }}
                >
                  {formatCategoryName(category)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPills;
