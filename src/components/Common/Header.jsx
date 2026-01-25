import { useState, useEffect } from 'react';
import { COLORS, SHADOWS, RADIUS, SPACING, FONTS } from '../../theme/colors';
import { SETTINGS } from '../../data/menuItems';
import { formatDate, formatTime } from '../../utils/dateUtils';

// Inline Styles
const styles = {
  header: {
    background: COLORS.white,
    padding: `${SPACING.lg} ${SPACING.xl}`,
    borderRadius: RADIUS.large,
    marginBottom: SPACING.lg,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: SHADOWS.medium,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONTS.huge,
    fontWeight: '600',
    margin: 0,
  },
  headerInfo: {
    display: 'flex',
    gap: SPACING.lg,
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
  },
  dateTime: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
};

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header style={styles.header}>
      <h1 style={styles.title}>🥪 {SETTINGS.shopName}</h1>
      <div style={styles.headerInfo}>
        <div style={styles.dateTime}>
          <span>{formatDate(currentTime)}</span>
          <span>{formatTime(currentTime)}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

