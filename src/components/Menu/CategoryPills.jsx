import * as Icons from "lucide-react";
import { Package } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import { CATEGORIES, DEFAULT_MENU } from "../../data/menuData";

// ✅ Categories that should ALWAYS show in home page
const DEFAULT_CATEGORIES = ["subs", "drinks", "hots", "saladrolls"];

const CategoryPills = () => {
  const { theme } = useTheme();
  const { activeCategory, setActiveCategory, menu } = usePOS();

  // ✅ Categories that have items in menu
  const menuCategories = Object.keys(menu).filter((cat) => (menu[cat] || []).length > 0);

  // ✅ Always include default categories even if they have 0 items
  const allCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...menuCategories]));

  // Check which categories are custom (not in DEFAULT_MENU)
  const isCustomCategory = (categoryId) => {
    return (
      !DEFAULT_MENU[categoryId] &&
      !["coffee", "fruittea", "milktea"].includes(categoryId) &&
      !DEFAULT_CATEGORIES.includes(categoryId)
    );
  };

  // Determine main categories
  const mainCategories = allCategories.filter((cat) => {
    if (cat === "subs") return true;
    if (cat === "drinks") return true;
    if (cat === "hots") return true;
    if (cat === "saladrolls") return true;
    if (["coffee", "fruittea", "milktea"].includes(cat)) return false;
    return true;
  });

  // Check if we have any drink subcategories in menu
  const hasDrinkSubcategories = allCategories.some((cat) =>
    ["coffee", "fruittea", "milktea"].includes(cat)
  );

  // Determine if DRINKS category is active
  const isDrinksActive =
    activeCategory === "drinks" || ["coffee", "fruittea", "milktea"].includes(activeCategory);

  // Get drink subcategories that exist in menu
  const drinkSubcategories =
    CATEGORIES.drinks?.filter((sub) => allCategories.includes(sub.id)) || [];

  // Get custom drink subcategories
  const customDrinkCategories = menuCategories.filter((cat) => {
    const item = menu[cat]?.[0];
    return (
      item?.parentCategory === "drinks" && !["coffee", "fruittea", "milktea"].includes(cat)
    );
  });

  const styles = {
    container: {
      padding: "20px 24px",
      background: theme.cardBg,
      borderBottom: `1px solid ${theme.border}`,
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
    }),
  };

  const formatCategoryName = (category) => {
    if (category === "saladrolls") return "SALAD ROLLS";
    return category.toUpperCase();
  };

  // Get icon based on category
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

  return (
    <>
      <style>{`
        /* Desktop (default - unchanged) */
        .category-pills-container {
          padding: 20px 24px;
        }

        .category-pills-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .category-sub-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        /* Hide scrollbar for mobile horizontal scroll */
        .category-pills-wrapper::-webkit-scrollbar,
        .category-sub-pills::-webkit-scrollbar {
          display: none;
        }

        /* Tablet: Reduce padding */
        @media (max-width: 1024px) {
          .category-pills-container {
            padding: 16px 20px !important;
          }
        }

        /* Mobile: Horizontal scroll, no wrap */
        @media (max-width: 768px) {
          .category-pills-container {
            padding: 14px 16px !important;
          }

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

          .category-pill-mobile {
            padding: 10px 20px !important;
            font-size: 13px !important;
          }

          .category-sub-pill-mobile {
            padding: 8px 16px !important;
            font-size: 12px !important;
          }

          .category-label-mobile {
            font-size: 13px !important;
          }
        }

        /* Small Mobile: Even more compact */
        @media (max-width: 480px) {
          .category-pills-container {
            padding: 12px !important;
          }

          .category-pill-mobile {
            padding: 8px 16px !important;
            font-size: 12px !important;
          }

          .category-sub-pill-mobile {
            padding: 7px 14px !important;
            font-size: 11px !important;
          }

          .category-pill-icon {
            width: 16px !important;
            height: 16px !important;
          }
        }
      `}</style>

      <div className="category-pills-container" style={styles.container}>
        <div className="category-label-mobile" style={styles.label}>
          Choose Category
        </div>

        {/* Main Categories */}
        <div className="category-pills-wrapper" style={styles.pillsContainer}>
          {mainCategories
            .filter((cat) => !isCustomCategory(cat))
            .map((category) => {
              const isActive =
                activeCategory === category || (category === "drinks" && isDrinksActive);

              const Icon = getCategoryIcon(category);

              return (
                <button
                  key={category}
                  className="category-pill-mobile"
                  style={styles.pill(isActive)}
                  onClick={() => {
                    if (category === "drinks") {
                      // If drink subcategories exist, go to first one, otherwise set drinks
                      if (drinkSubcategories.length > 0)
                        setActiveCategory(drinkSubcategories[0].id);
                      else if (customDrinkCategories.length > 0)
                        setActiveCategory(customDrinkCategories[0]);
                      else setActiveCategory("drinks");
                    } else {
                      setActiveCategory(category);
                    }
                  }}
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

          {/* Custom Categories (NO delete button) */}
          {mainCategories
            .filter((cat) => isCustomCategory(cat))
            .map((category) => {
              const isActive = activeCategory === category;

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
        {isDrinksActive && (hasDrinkSubcategories || customDrinkCategories.length > 0) && (
          <div className="category-sub-pills" style={styles.subCategoriesRow}>
            {drinkSubcategories.map((subCategory) => {
              const isActive = activeCategory === subCategory.id;

              return (
                <button
                  key={subCategory.id}
                  className="category-sub-pill-mobile"
                  style={styles.subPill(isActive)}
                  onClick={() => setActiveCategory(subCategory.id)}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = theme.bgSecondary;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = theme.bgHover;
                  }}
                >
                  {subCategory.name}
                </button>
              );
            })}

            {customDrinkCategories.map((category) => {
              const isActive = activeCategory === category;

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