import { useTheme } from '../../context/ThemeContext';
import CategoryPills from '../../components/Menu/CategoryPills';
import MenuGrid from '../../components/Menu/MenuGrid';
import OrderPanel from '../../components/Order/OrderPanel';

const HomePage = () => {
  const { theme } = useTheme();

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      background: theme.bgPrimary,
      overflow: 'hidden',
    },
    leftSection: {
      flex: 1,
      marginRight: '400px', // Space for OrderPanel
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      overflow: 'hidden',
    },
    menuArea: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingBottom: '40px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          /* Hide scrollbar for home page */
          .menu-scrollable::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div style={styles.leftSection}>
        <CategoryPills />
        <div style={styles.menuArea} className="menu-scrollable">
          <MenuGrid />
        </div>
      </div>
      <OrderPanel />
    </div>
  );
};

export default HomePage;