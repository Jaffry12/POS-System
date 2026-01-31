import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import MenuItem from "./MenuItem";
import { Search, Package } from "lucide-react";

const MenuGrid = () => {
  const { theme } = useTheme();
  const { getFilteredItems, activeCategory } = usePOS();

  const items = getFilteredItems();
  const isHome = !activeCategory;

  const styles = {
    container: {
      padding: "24px",
      height: "100%",
      // ✅ key: extra space so last row never cuts
      paddingBottom: "calc(60px + env(safe-area-inset-bottom))",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "20px",

      // ✅ key: extra space after grid items
      paddingBottom: "calc(80px + env(safe-area-inset-bottom))",

      alignItems: "start",
      gridAutoRows: "max-content",
    },

    // Home state
    homeState: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
    },
    homeCard: {
      textAlign: "center",
      maxWidth: "520px",
      width: "100%",
      padding: "10px 0",
    },
    homeIconWrap: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "88px",
      height: "88px",
      borderRadius: "999px",
      background: theme.bgHover,
      marginBottom: "18px",
    },
    homeTitle: {
      fontSize: "28px",
      fontWeight: "800",
      color: theme.textPrimary,
      marginBottom: "10px",
    },
    homeSub: {
      fontSize: "16px",
      fontWeight: "500",
      color: theme.textSecondary,
      lineHeight: "1.5",
    },

    // Empty state
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: theme.textLight,
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
        .menu-grid-container {
          padding: 24px;
          height: 100%;
          padding-bottom: calc(60px + env(safe-area-inset-bottom)); /* ✅ */
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          padding-bottom: calc(80px + env(safe-area-inset-bottom)); /* ✅ */
          align-items: start;
          grid-auto-rows: max-content;
        }

        @media (max-width: 1024px) {
          .menu-grid-container { padding: 20px !important; padding-bottom: calc(70px + env(safe-area-inset-bottom)) !important; }
          .menu-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important;
            gap: 16px !important;
            padding-bottom: calc(90px + env(safe-area-inset-bottom)) !important;
          }
          .menu-home-title { font-size: 24px !important; }
          .menu-home-sub { font-size: 15px !important; }
        }

        @media (max-width: 768px) {
          .menu-grid-container { padding: 16px !important; padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; }
          .menu-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
            padding-bottom: calc(110px + env(safe-area-inset-bottom)) !important;
          }
          .menu-empty-state { padding: 40px 16px !important; }
          .menu-home-icon { width: 74px !important; height: 74px !important; }
          .menu-home-title { font-size: 22px !important; }
          .menu-home-sub { font-size: 14px !important; }
        }

        @media (max-width: 480px) {
          .menu-grid-container { padding: 12px !important; padding-bottom: calc(90px + env(safe-area-inset-bottom)) !important; }
          .menu-grid { gap: 10px !important; padding-bottom: calc(120px + env(safe-area-inset-bottom)) !important; }
          .menu-empty-text { font-size: 14px !important; }
          .menu-home-title { font-size: 20px !important; }
          .menu-home-sub { font-size: 13px !important; }
        }
      `}</style>

      <div className="menu-grid-container" style={styles.container}>
        {isHome ? (
          <div style={styles.homeState}>
            <div style={styles.homeCard}>
              <div className="menu-home-icon" style={styles.homeIconWrap}>
                <Package size={38} color={theme.textSecondary} />
              </div>
              <div className="menu-home-title" style={styles.homeTitle}>
                Select a Category
              </div>
              <div className="menu-home-sub" style={styles.homeSub}>
                Choose a category from above to view available menu items
              </div>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="menu-empty-state" style={styles.emptyState}>
       
           
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
