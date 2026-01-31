import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import MenuItem from "./MenuItem";
import { Search } from "lucide-react";

const MenuGrid = () => {
  const { theme } = useTheme();
  const { getFilteredItems } = usePOS();

  const items = getFilteredItems();

  const styles = {
    container: {
      padding: "24px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "20px",
      paddingBottom: "20px",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: theme.textLight,
      gridColumn: "1 / -1",
    },
    emptyIconWrap: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "56px",
      height: "56px",
      borderRadius: "14px",
      background: theme.bgHover,
      marginBottom: "16px",
    },
    emptyText: {
      fontSize: "16px",
      fontWeight: "500",
      color: theme.textSecondary,
    },
  };

  return (
    <>
      <style>{`
        /* Desktop (default) */
        .menu-grid-container {
          padding: 24px;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          padding-bottom: 20px;
        }

        /* Tablet: Reduce gap and padding */
        @media (max-width: 1024px) {
          .menu-grid-container {
            padding: 20px !important;
          }

          .menu-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important;
            gap: 16px !important;
            padding-bottom: 20px !important;
          }
        }

        /* Mobile: 2 columns, smaller gap */
        @media (max-width: 768px) {
          .menu-grid-container {
            padding: 16px !important;
          }

          .menu-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
            padding-bottom: 20px !important;
          }

          .menu-empty-state {
            padding: 40px 16px !important;
          }
        }

        /* Small Mobile: Smaller gap */
        @media (max-width: 480px) {
          .menu-grid-container {
            padding: 12px !important;
          }

          .menu-grid {
            gap: 10px !important;
            padding-bottom: 20px !important;
          }

          .menu-empty-icon {
            width: 48px !important;
            height: 48px !important;
          }

          .menu-empty-text {
            font-size: 14px !important;
          }
        }
      `}</style>

      <div className="menu-grid-container" style={styles.container}>
        {items.length === 0 ? (
          <div className="menu-empty-state" style={styles.emptyState}>
            <div className="menu-empty-icon" style={styles.emptyIconWrap}>
              <Search size={22} color={theme.textSecondary} />
            </div>
            <div className="menu-empty-text" style={styles.emptyText}>
              No items found
            </div>
          </div>
        ) : (
          <div className="menu-grid" style={styles.grid}>
            {items.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MenuGrid;