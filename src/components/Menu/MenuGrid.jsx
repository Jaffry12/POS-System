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
    <div style={styles.container}>
      {items.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIconWrap}>
            <Search size={22} color={theme.textSecondary} />
          </div>
          <div style={styles.emptyText}>No items found</div>
        </div>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuGrid;
