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
    // SUBS category
    if (cat === 'subs') return true;
    
    // DRINKS category (if any drink subcategory exists)
    if (cat === 'drinks') return false; // Never show drinks directly
    if (['coffee', 'fruittea', 'milktea'].includes(cat)) {
      return false; // These are handled under DRINKS
    }
    
    // Custom categories
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
    }),
  };

  return (
    <div style={styles.container}>
      <div style={styles.label}>Choose Category</div>
      
      {/* Main Categories: SUBS, DRINKS, and Custom Categories */}
      <div style={styles.pillsContainer}>
        {/* SUBS */}
        {mainCategories.includes('subs') && (
          <button
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
            <Icons.Sandwich size={18} />
            SUBS
          </button>
        )}

        {/* DRINKS (if any drink subcategories exist) */}
        {hasDrinkSubcategories && (
          <button
            style={styles.pill(isDrinksActive)}
            onClick={() => {
              // Default to first available drink subcategory
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
            <Icons.Coffee size={18} />
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
              <Package size={18} />
              {category.toUpperCase()}
              
              {/* Delete button for custom categories */}
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

      {/* Drink Subcategories - shown when DRINKS is active */}
      {isDrinksActive && (
        <div style={styles.subCategoriesRow}>
          {/* Default drink subcategories */}
          {drinkSubcategories.map((subCategory) => {
            const isActive = activeCategory === subCategory.id;

            return (
              <button
                key={subCategory.id}
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

          {/* Custom drink subcategories */}
          {customDrinkCategories.map((category) => {
            const isActive = activeCategory === category;
            const isHovered = hoveredCategory === category;

            return (
              <button
                key={category}
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
                
                {/* Delete button for custom drink categories */}
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
  );
};

export default CategoryPills;