import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useTheme } from '../../context/ThemeContext';

const MainLayout = () => {
  const { theme } = useTheme();

  const styles = {
    layout: {
      display: 'flex',
      minHeight: '100vh',
      background: theme.bgPrimary,
    },
    mainContent: {
      marginLeft: '240px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    contentArea: {
      flex: 1,
      overflow: 'auto',
    },
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.mainContent}>
        <TopBar />
        <div style={styles.contentArea}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;