import * as Icons from 'lucide-react';
import { Trash2, Package } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePOS } from '../../hooks/usePOS';
import { CATEGORIES, DEFAULT_MENU } from '../../data/menuData';
import { useState } from 'react';

const CategoryPills = () => {
  const { theme } = useTheme();
  const { activeCategory, setActiveCategory, menu, deleteCategory } = usePOS();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Get all categories from menu
  const allCategories = Object.keys(menu).filter(cat => menu[cat]?.length > 0);

  // Check which categories are custom (not in DEFAULT_MENU)
  const isCustomCategory = (categoryId) => {
    return !DEFAULT_MENU[categoryId] && 
           !['coffee', 'fruittea', 'milktea'].includes(categoryId);
  };

  // Determine main categories
  const mainCategories = allCategories.filter(cat => {
    if (cat === 'subs') return true;
    if (cat === 'drinks') return false;
    if (['coffee', 'fruittea', 'milktea'].includes(cat)) {
      return false;
    }
    return true;
  });

  // Check if we have any drink subcategories
  const hasDrinkSubcategories = allCategories.some(cat => 
    ['coffee', 'fruittea', 'milktea'].includes(cat)
  );

  // Determine if DRINKS category is active
  const isDrinksActive = ['coffee', 'fruittea', 'milktea'].includes(activeCategory);

  // Get drink subcategories that exist in menu
  const drinkSubcategories = CATEGORIES.drinks?.filter(sub => 
    allCategories.includes(sub.id)
  ) || [];

  // Get custom drink subcategories
  const customDrinkCategories = allCategories.filter(cat => {
    const item = menu[cat]?.[0];
    return item?.parentCategory === 'drinks' && !['coffee', 'fruittea', 'milktea'].includes(cat);
  });

  const handleDeleteCategory = (e, categoryId) => {
    e.stopPropagation();
    deleteCategory(categoryId);
  };

  const styles = {
    container: {
      padding: '20px 24px',
      background: theme.cardBg,
      borderBottom: `1px solid ${theme.border}`,
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: theme.textSecondary,
      marginBottom: '12px',
    },
    pillsContainer: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    pill: (isActive) => ({
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      background: isActive ? theme.primary : theme.bgSecondary,
      color: isActive ? '#FFFFFF' : theme.textPrimary,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      textTransform: 'uppercase',
      position: 'relative',
      flexShrink: 0,
    }),
    deleteButton: {
      marginLeft: '8px',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: 'rgba(239, 68, 68, 0.9)',
      border: 'none',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    subCategoriesRow: {
      marginTop: '12px',
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    subPill: (isActive) => ({
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      background: isActive ? theme.primary : theme.bgHover,
      color: isActive ? '#FFFFFF' : theme.textSecondary,
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    }),
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
        <div className="category-label-mobile" style={styles.label}>Choose Category</div>
        
        {/* Main Categories: SUBS, DRINKS, and Custom Categories */}
        <div className="category-pills-wrapper" style={styles.pillsContainer}>
          {/* SUBS */}
          {mainCategories.includes('subs') && (
            <button
              className="category-pill-mobile"
              style={styles.pill(activeCategory === 'subs')}
              onClick={() => setActiveCategory('subs')}
              onMouseEnter={(e) => {
                if (activeCategory !== 'subs') {
                  e.currentTarget.style.background = theme.bgHover;
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== 'subs') {
                  e.currentTarget.style.background = theme.bgSecondary;
                }
              }}
            >
              <Icons.Sandwich className="category-pill-icon" size={18} />
              SUBS
            </button>
          )}

          {/* DRINKS */}
          {hasDrinkSubcategories && (
            <button
              className="category-pill-mobile"
              style={styles.pill(isDrinksActive)}
              onClick={() => {
                if (drinkSubcategories.length > 0) {
                  setActiveCategory(drinkSubcategories[0].id);
                } else if (customDrinkCategories.length > 0) {
                  setActiveCategory(customDrinkCategories[0]);
                }
              }}
              onMouseEnter={(e) => {
                if (!isDrinksActive) {
                  e.currentTarget.style.background = theme.bgHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isDrinksActive) {
                  e.currentTarget.style.background = theme.bgSecondary;
                }
              }}
            >
              <Icons.Coffee className="category-pill-icon" size={18} />
              DRINKS
            </button>
          )}

          {/* Custom Categories */}
          {mainCategories.filter(cat => isCustomCategory(cat)).map((category) => {
            const isActive = activeCategory === category;
            const isHovered = hoveredCategory === category;

            return (
              <button
                key={category}
                className="category-pill-mobile"
                style={styles.pill(isActive)}
                onClick={() => setActiveCategory(category)}
                onMouseEnter={(e) => {
                  setHoveredCategory(category);
                  if (!isActive) {
                    e.currentTarget.style.background = theme.bgHover;
                  }
                }}
                onMouseLeave={(e) => {
                  setHoveredCategory(null);
                  if (!isActive) {
                    e.currentTarget.style.background = theme.bgSecondary;
                  }
                }}
              >
                <Package className="category-pill-icon" size={18} />
                {category.toUpperCase()}
                
                {(isHovered || isActive) && (
                  <button
                    style={styles.deleteButton}
                    onClick={(e) => handleDeleteCategory(e, category)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 1)';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    title="Delete category"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </button>
            );
          })}
        </div>

        {/* Drink Subcategories */}
        {isDrinksActive && (
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
                    if (!isActive) {
                      e.currentTarget.style.background = theme.bgSecondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = theme.bgHover;
                    }
                  }}
                >
                  {subCategory.name}
                </button>
              );
            })}

            {customDrinkCategories.map((category) => {
              const isActive = activeCategory === category;
              const isHovered = hoveredCategory === category;

              return (
                <button
                  key={category}
                  className="category-sub-pill-mobile"
                  style={{
                    ...styles.subPill(isActive),
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onClick={() => setActiveCategory(category)}
                  onMouseEnter={(e) => {
                    setHoveredCategory(category);
                    if (!isActive) {
                      e.currentTarget.style.background = theme.bgSecondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    setHoveredCategory(null);
                    if (!isActive) {
                      e.currentTarget.style.background = theme.bgHover;
                    }
                  }}
                >
                  {category.toUpperCase()}
                  
                  {(isHovered || isActive) && (
                    <button
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'rgba(239, 68, 68, 0.9)',
                        border: 'none',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        marginLeft: '4px',
                      }}
                      onClick={(e) => handleDeleteCategory(e, category)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 1)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      title="Delete category"
                    >
                      <Trash2 size={10} />
                    </button>
                  )}
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